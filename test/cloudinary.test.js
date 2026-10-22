import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { boot } from './helpers.js';
import { ttsProviders } from '../src/providers/speech.js';
import { ensureAudio } from '../src/cloudinary/audio.js';
import { ttsKey } from '../src/cloudinary/paths.js';
import { sweepVoice } from '../src/cloudinary/voice.js';
import { allSpeakables } from '../src/content/speakables.js';

test('TTS audio: synthesized once per (text, lang), single-flight under concurrency', async () => {
  const { db, close } = await boot();
  let calls = 0; const orig = ttsProviders.mock.synthesize;
  ttsProviders.mock.synthesize = async (...a) => { calls++; await new Promise((r) => setTimeout(r, 30)); return orig(...a); };
  try {
    const rs = await Promise.all(Array.from({ length: 8 }, () => ensureAudio(db, 'Pay in full, every month.', 'en')));
    assert.equal(calls, 1); assert.equal(new Set(rs.map((r) => r.url)).size, 1);
    const again = await ensureAudio(db, 'Pay in full, every month.', 'en');
    assert.equal(again.cached, true); assert.equal(calls, 1);
    await ensureAudio(db, 'Pay in full, every month.', 'hi'); assert.equal(calls, 2); // other language = other asset
    db.exec('DELETE FROM tts_cache'); // simulate DB loss: asset is found in the store, no new synthesis
    await ensureAudio(db, 'Pay in full, every month.', 'en'); assert.equal(calls, 2);
  } finally { ttsProviders.mock.synthesize = orig; close(); }
});

test('audio endpoint only speaks known ids; falls back to text if TTS fails', async () => {
  const { call, user, close } = await boot();
  const { token } = await user('en');
  assert.equal((await call('GET', '/api/audio/lesson:L1', null, token)).status, 200);
  assert.equal((await call('GET', '/api/audio/anything:else', null, token)).status, 404);
  const orig = ttsProviders.mock.synthesize; ttsProviders.mock.synthesize = async () => { throw new Error('provider down'); };
  const r = await call('GET', '/api/audio/night:n_save', null, token);
  ttsProviders.mock.synthesize = orig;
  assert.equal(r.status, 503); assert.equal(r.json.fallback, 'text');
  close();
});

test('every speakable has text in every language and a stable key', () => {
  const all = allSpeakables(); assert.ok(all.length >= 50);
  assert.ok(all.every((s) => s.text && s.text.length < 1500)); // under Sarvam v2 limit too
  assert.equal(ttsKey('a  b', 'en'), ttsKey('a b', 'en'));
  assert.notEqual(ttsKey('a b', 'en'), ttsKey('a b', 'hi'));
});

async function recordAndUpload(call, token, bytes) {
  const s = (await call('POST', '/api/voice/sign', null, token)).json;
  assert.ok(s.publicId.includes('/voice/')); assert.equal(s.fields.type, 'authenticated');
  const up = await call('POST', `/api/voice/mock-upload?public_id=${encodeURIComponent(s.publicId)}`, bytes, token, true);
  assert.equal(up.status, 200);
  return s;
}

test('voice: upload -> transcribe -> intent -> asset destroyed', async () => {
  const { call, user, store, close } = await boot();
  const { token } = await user('en');
  const s = await recordAndUpload(call, token, Buffer.from('haan ji'));
  assert.ok(await store.inspect(s.publicId, { type: 'authenticated' }));
  const r = await call('POST', '/api/voice/transcribe', { publicId: s.publicId, optionIds: ['yes', 'no', 'unsure'] }, token);
  assert.equal(r.json.transcript, 'haan ji'); assert.equal(r.json.match, 'yes');
  assert.equal(await store.inspect(s.publicId, { type: 'authenticated' }), null); // gone
  assert.equal((await call('POST', '/api/voice/transcribe', { publicId: s.publicId }, token)).status, 404); // cannot reuse
  close();
});

test('voice: cannot transcribe someone else\'s or an unsigned asset; oversize is rejected and deleted', async () => {
  const { call, user, store, close } = await boot();
  const a = await user(), b = await user();
  const s = await recordAndUpload(call, a.token, Buffer.from('no'));
  assert.equal((await call('POST', '/api/voice/transcribe', { publicId: s.publicId }, b.token)).status, 404);
  assert.equal((await call('POST', '/api/voice/transcribe', { publicId: 'credit-ladder/voice/x/y' }, a.token)).status, 404);
  const big = await recordAndUpload(call, a.token, Buffer.alloc(2 * 1024 * 1024 - 10, 1));
  // pretend 3 MB
  const orig = store.inspect.bind(store); store.inspect = async (...x) => ({ ...(await orig(...x)), bytes: 3e6 });
  const r = await call('POST', '/api/voice/transcribe', { publicId: big.publicId }, a.token);
  store.inspect = orig;
  assert.equal(r.status, 422);
  assert.equal(await orig(big.publicId, { type: 'authenticated' }), null);
  close();
});

test('voice sweep removes abandoned recordings, including orphans', async () => {
  const { call, user, store, db, close } = await boot();
  const { token } = await user();
  const s = await recordAndUpload(call, token, Buffer.from('yes'));
  await store.upload(Buffer.from('orphan'), { publicId: 'credit-ladder/voice/ghost/1', type: 'authenticated' });
  assert.equal(await sweepVoice(db, 60), 0); // fresh files survive
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(await sweepVoice(db, 0) >= 2);
  assert.equal(await store.inspect(s.publicId, { type: 'authenticated' }), null);
  close();
});

test('webhook: bad signature rejected, good one records the upload', async () => {
  const { call, user, store, db, base, close } = await boot();
  const { token } = await user();
  const s = (await call('POST', '/api/voice/sign', null, token)).json;
  const body = JSON.stringify({ notification_type: 'upload', public_id: s.publicId, bytes: 1234, duration: 4.2, format: 'webm' });
  const ts = String(Math.floor(Date.now() / 1000));
  const post = (headers) => fetch(`${base}/api/webhooks/cloudinary`, { method: 'POST', body, headers });
  assert.equal((await post({})).status, 401);
  assert.equal((await post({ 'x-cld-timestamp': ts, 'x-cld-signature': 'deadbeef' })).status, 401);
  assert.equal((await post({ 'x-cld-timestamp': String(Number(ts) - 99999), 'x-cld-signature': crypto.createHash('sha1').update(body + (Number(ts) - 99999) + store.secret).digest('hex') })).status, 401); // stale
  const sig = crypto.createHash('sha1').update(body + ts + store.secret).digest('hex');
  assert.equal((await post({ 'x-cld-timestamp': ts, 'x-cld-signature': sig })).status, 200);
  const row = db.prepare('SELECT status, bytes, duration FROM assets WHERE public_id=?').get(s.publicId);
  assert.deepEqual({ ...row }, { status: 'uploaded', bytes: 1234, duration: 4.2 });
  close();
});
