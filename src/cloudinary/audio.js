// Cached lesson audio. Policy: synthesize each (text, language, voice) ONCE, store in Cloudinary, serve from CDN forever.
// Lookup order: SQLite (free) -> Cloudinary Admin API (only after a DB wipe) -> TTS provider (paid) -> upload.
import { getStore } from './store.js';
import { ttsKey, ttsPublicId } from './paths.js';
import { getTts } from '../providers/speech.js';
import { config } from '../config.js';
import { now } from '../db.js';

// Same transformation for eager build and delivery, so the first listener already hits a warm CDN derivative.
export const AUDIO_TX = { format: 'mp3', transformation: [{ audio_codec: 'mp3', bit_rate: '48k' }] };
const EAGER = [{ format: 'mp3', audio_codec: 'mp3', bit_rate: '48k' }];
const inflight = new Map(); // single-flight: 50 users opening the same new lesson cause ONE synthesis

export async function ensureAudio(db, text, lang) {
  const store = getStore();
  const voice = config.tts.provider === 'sarvam' ? config.sarvam.speaker : 'mock';
  const key = ttsKey(text, lang, voice);
  const publicId = ttsPublicId(key, lang);
  const urlFor = () => store.url(publicId, { resourceType: 'video', tx: AUDIO_TX });

  const hit = db.prepare('SELECT public_id FROM tts_cache WHERE key = ?').get(key);
  if (hit) return { url: urlFor(), publicId, cached: true };

  if (inflight.has(key)) return inflight.get(key);
  const job = (async () => {
    let bytes = null, fresh = false;
    const found = await store.inspect(publicId, { resourceType: 'video' });
    if (found) bytes = found.bytes;
    else {
      const { buffer } = await getTts().synthesize(text, lang);
      const up = await store.upload(buffer, {
        publicId, resourceType: 'video', tags: ['tts', `lang_${lang}`], overwrite: false, eager: EAGER,
        context: { lang, chars: String(text.length) },
      });
      bytes = up.bytes; fresh = !up.existing;
    }
    db.prepare('INSERT OR IGNORE INTO tts_cache (key, public_id, lang, bytes, created_at) VALUES (?,?,?,?,?)').run(key, publicId, lang, bytes, now());
    return { url: urlFor(), publicId, cached: !fresh };
  })().finally(() => inflight.delete(key));
  inflight.set(key, job);
  return job;
}
