// Pre-generates TTS audio for every lesson/question in every language, so no learner ever waits on synthesis
// and TTS cost is paid exactly once per string. Safe to re-run (cache hits are free).
import { openDb } from '../src/db.js';
import { allSpeakables } from '../src/content/speakables.js';
import { ensureAudio } from '../src/cloudinary/audio.js';

const db = openDb();
const list = allSpeakables();
let fresh = 0, cached = 0, failed = 0, i = 0;
async function worker() {
  while (i < list.length) {
    const s = list[i++];
    try { const r = await ensureAudio(db, s.text, s.lang); r.cached ? cached++ : fresh++; }
    catch (e) { failed++; console.error(`FAILED ${s.id} (${s.lang}): ${e.message}`); }
  }
}
await Promise.all([worker(), worker(), worker()]); // 3 at a time: friendly to provider rate limits
console.log(`audio: ${fresh} generated, ${cached} already cached, ${failed} failed, of ${list.length}`);
process.exit(failed ? 1 : 0);
