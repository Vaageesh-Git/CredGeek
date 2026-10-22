// Exercises the REAL Cloudinary SDK code paths (URL building, signing, webhook verification) with fake credentials.
// No network calls are made. Live behaviour is covered by `npm run cloudinary:check`.
import './env-real.js'; // must be first: ES imports are hoisted, so env has to be set by an import
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStore, setStore } from '../src/cloudinary/store.js';
import { config } from '../src/config.js';
import { AUDIO_TX } from '../src/cloudinary/audio.js';
import { imageSet } from '../src/cloudinary/images.js';
import { createVoiceUpload } from '../src/cloudinary/voice.js';
import { openDb } from '../src/db.js';

const store = new CloudinaryStore(config.cloudinary);
setStore(store);

test('config parses CLOUDINARY_URL', () => {
  assert.equal(config.cloudinary.cloudName, 'democloud'); assert.equal(config.cloudinary.mock, false);
});

test('config refuses mock in production and refuses missing credentials', () => {
  const run = (env) => { try { execFileSync(process.execPath, ['-e', "import('./src/config.js').then(()=>console.log('LOADED'))"], { env: { PATH: process.env.PATH, DOTENV_CONFIG_PATH: '/dev/null', CLOUDINARY_MOCK: '0', ...env }, encoding: 'utf8', stdio: 'pipe' }); return 'LOADED'; } catch (e) { return String(e.stderr); } };
  assert.match(run({ NODE_ENV: 'production', CLOUDINARY_MOCK: '1', JWT_SECRET: 'x'.repeat(40) }), /refused in production/);
  assert.match(run({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(40) }), /credentials missing/);
  assert.match(run({ NODE_ENV: 'production', CLOUDINARY_URL: 'cloudinary://a:b@c', JWT_SECRET: 'short' }), /JWT_SECRET/);
  assert.equal(run({ NODE_ENV: 'production', CLOUDINARY_URL: 'cloudinary://a:b@c', JWT_SECRET: 'x'.repeat(40) }).trim(), 'LOADED');
});

test('audio URL: CDN video resource, mp3, 48k bitrate', () => {
  const u = store.url('credit-ladder/tts/hi/abc', { resourceType: 'video', tx: AUDIO_TX });
  assert.match(u, /^https:\/\/res\.cloudinary\.com\/democloud\/video\/upload\//);
  assert.match(u, /br_48k/); assert.match(u, /abc\.mp3$/);
});

test('image URLs: f_auto, q_auto and responsive srcset', () => {
  const s = imageSet('lessons', 'L1');
  assert.match(s.src, /f_auto/); assert.match(s.src, /q_auto/); assert.match(s.src, /w_480/);
  assert.equal(s.srcset.match(/ \d+w/g).length, 4); assert.match(s.srcset, /w_160[^ ]* 160w/);
});

test('signed upload: signature verifies with the SDK and covers every sent param', () => {
  const db = openDb(':memory:');
  db.prepare("INSERT INTO users (id,nick,pin_hash,created_at,last_seen) VALUES ('u1','n','x',1,1)").run();
  const v = createVoiceUpload(db, 'u1');
  assert.equal(v.uploadUrl, 'https://api.cloudinary.com/v1_1/democloud/video/upload');
  assert.equal(v.fields.type, 'authenticated'); assert.ok(v.publicId.startsWith('credit-ladder/voice/u1/'));
  assert.equal(v.fields.api_key, '123456'); assert.ok(!JSON.stringify(v).includes('topsecret')); // secret never leaves the server
  const { signature, api_key, ...signed } = v.fields;
  assert.equal(signature, cloudinary.utils.api_sign_request(signed, 'topsecret'));
  assert.notEqual(signature, cloudinary.utils.api_sign_request({ ...signed, public_id: 'credit-ladder/voice/someone-else/1' }, 'topsecret')); // tampering breaks it
});

test('private download URL is short-lived and for the authenticated type', () => {
  const u = new URL(store.privateDownloadUrl('credit-ladder/voice/u1/a', { resourceType: 'video', type: 'authenticated', format: 'webm', ttlSec: 120 }));
  assert.match(u.pathname, /\/v1_1\/democloud\/video\/download/);
  assert.equal(u.searchParams.get('type'), 'authenticated');
  const exp = Number(u.searchParams.get('expires_at')); const now = Date.now() / 1000;
  assert.ok(exp > now && exp <= now + 130);
  assert.ok(u.searchParams.get('signature'));
});

test('webhook verification matches Cloudinary\'s algorithm', () => {
  const body = '{"notification_type":"upload"}'; const ts = Math.floor(Date.now() / 1000);
  const good = crypto.createHash('sha1').update(body + ts + 'topsecret').digest('hex');
  assert.equal(store.verifyWebhook(body, ts, good), true);
  assert.equal(store.verifyWebhook(body + ' ', ts, good), false);
  assert.equal(store.verifyWebhook(body, ts, 'nope'), false);
});
