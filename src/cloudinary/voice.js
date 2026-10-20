// Voice answers: browser -> Cloudinary (signed, authenticated delivery) -> server inspects + transcribes -> asset DESTROYED.
// The audio of a woman speaking about her money is the most sensitive thing we touch, so it lives for seconds, not days.
import { getStore } from './store.js';
import { paths } from './paths.js';
import { getStt } from '../providers/speech.js';
import { config } from '../config.js';
import { now } from '../db.js';

const RES = { resourceType: 'video', type: 'authenticated' };
export class VoiceError extends Error { constructor(msg, status = 422) { super(msg); this.status = status; } }

export function createVoiceUpload(db, userId) {
  const store = getStore();
  const publicId = paths.voiceId(userId);
  const hook = config.baseUrl.startsWith('https://') ? `${config.baseUrl}/api/webhooks/cloudinary` : undefined;
  const params = {
    public_id: publicId, type: 'authenticated', tags: 'voice', allowed_formats: config.voice.formats.join(','),
    ...(hook ? { notification_url: hook } : {}),
  };
  const signed = store.signUpload(params);
  db.prepare('INSERT INTO assets (public_id, user_id, kind, resource_type, type, status, created_at) VALUES (?,?,?,?,?,?,?)')
    .run(publicId, userId, 'voice', RES.resourceType, RES.type, 'signed', now());
  return {
    publicId, maxSeconds: config.voice.maxSeconds, mock: !!signed.mock,
    uploadUrl: signed.mock ? '/api/voice/mock-upload' : `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`,
    fields: { api_key: signed.apiKey, signature: signed.signature, ...signed.params },
  };
}

async function readBytes(store, publicId, format) {
  if (store.fetchBytes) return store.fetchBytes(publicId, RES.type);
  const url = store.privateDownloadUrl(publicId, { ...RES, format });
  const r = await fetch(url);
  if (!r.ok) throw new VoiceError(`Could not read audio (${r.status})`, 502);
  return Buffer.from(await r.arrayBuffer());
}

export async function transcribeVoice(db, userId, publicId, lang) {
  const store = getStore();
  // 1. Ownership: only assets WE signed for THIS user, inside THIS user's folder.
  const row = db.prepare('SELECT * FROM assets WHERE public_id = ? AND user_id = ? AND kind = ?').get(publicId, userId, 'voice');
  if (!row || !publicId.startsWith(paths.voicePrefix(userId)) || row.status === 'deleted') throw new VoiceError('Unknown voice upload', 404);
  try {
    // 2. Facts: trust the webhook record if present, else ask Cloudinary once.
    const info = row.bytes ? { bytes: row.bytes, duration: row.duration, format: row.format } : await store.inspect(publicId, RES);
    if (!info) throw new VoiceError('Upload not found. Try recording again.', 404);
    if (info.bytes > config.voice.maxBytes) throw new VoiceError('Recording too large');
    if (info.duration && info.duration > config.voice.maxSeconds + 2) throw new VoiceError('Recording too long');
    // 3. Transcribe from a short-lived private URL (never a public one).
    const audio = await readBytes(store, publicId, info.format);
    const transcript = (await getStt().transcribe(audio, { lang, mime: `audio/${info.format === 'm4a' ? 'mp4' : info.format || 'webm'}` })).trim();
    return { transcript };
  } finally {
    // 4. Always destroy, success or failure.
    await store.destroy(publicId, RES).catch(() => {});
    db.prepare("UPDATE assets SET status = 'deleted' WHERE public_id = ?").run(publicId);
  }
}

export function recordUploadNotification(db, n) {
  if (n.notification_type !== 'upload' || !n.public_id) return false;
  const r = db.prepare("UPDATE assets SET status = 'uploaded', bytes = ?, duration = ?, format = ? WHERE public_id = ? AND status = 'signed'")
    .run(n.bytes ?? null, n.duration ?? null, n.format ?? null, n.public_id);
  return r.changes > 0;
}

// Safety net: anything still alive after VOICE_MAX_AGE_MIN is removed (abandoned recordings, crashed requests).
export async function sweepVoice(db, maxAgeMin = config.voiceMaxAgeMin) {
  const store = getStore();
  const cutoff = now() - maxAgeMin * 60_000;
  let removed = 0;
  for (const r of db.prepare("SELECT public_id FROM assets WHERE kind='voice' AND status != 'deleted' AND created_at < ?").all(cutoff)) {
    await store.destroy(r.public_id, RES).catch(() => {});
    db.prepare("UPDATE assets SET status='deleted' WHERE public_id = ?").run(r.public_id); removed++;
  }
  for (const a of await store.listByPrefix(`${paths.root}/voice/`, RES)) { // orphans the DB never knew about
    if (a.createdAt < cutoff) { await store.destroy(a.publicId, RES).catch(() => {}); removed++; }
  }
  return removed;
}

export async function deleteAllVoiceFor(db, userId) {
  await getStore().destroyPrefix(paths.voicePrefix(userId), RES);
  db.prepare("UPDATE assets SET status='deleted' WHERE user_id = ?").run(userId);
}
