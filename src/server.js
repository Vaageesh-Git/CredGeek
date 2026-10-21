import { config } from './config.js';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { sweepVoice } from './cloudinary/voice.js';
import { seedImages } from './cloudinary/seed.js';

const db = openDb();
const app = createApp(db);
const sweep = () => sweepVoice(db).then((n) => n && console.log(`voice sweep removed ${n}`)).catch((e) => console.error('sweep failed', e.message));
setInterval(sweep, 15 * 60_000).unref();
sweep();
seedImages().then((n) => n && console.log(`seeded ${n} placeholder images`)).catch((e) => console.error('image seed failed:', e.message)); // idempotent; replace art later with overwrite
app.listen(config.port, () => console.log(`CredGeek on :${config.port}  cloudinary=${config.cloudinary.mock ? 'MOCK (dev only)' : 'live'}`));
