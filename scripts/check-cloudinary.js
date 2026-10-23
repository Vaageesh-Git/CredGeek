// Live smoke test against YOUR Cloudinary account. Run after setting credentials:  npm run cloudinary:check
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../src/config.js';
import { getStore } from '../src/cloudinary/store.js';
import { AUDIO_TX } from '../src/cloudinary/audio.js';

if (config.cloudinary.mock) { console.log('Mock mode: nothing to check. Set real credentials and CLOUDINARY_MOCK=0.'); process.exit(0); }
const store = getStore(); const root = `${config.cloudinary.rootFolder}/_check`;
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
function makeWav(seconds = 1) {
  const rate = 8000, n = Math.floor(rate * seconds), buf = Buffer.alloc(44 + n);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate, 28);
  buf.writeUInt16LE(1, 32); buf.writeUInt16LE(8, 34); buf.write('data', 36); buf.writeUInt32LE(n, 40);
  for (let i = 0; i < n; i++) buf[44 + i] = 128 + Math.round(20 * Math.sin((2 * Math.PI * 440 * i) / rate));
  return buf;
}
const wav = makeWav(1);
const steps = [];
const step = async (name, fn) => { try { const d = await fn(); steps.push([true, name, d]); } catch (e) { steps.push([false, name, e.message || JSON.stringify(e)]); } };

await step('API credentials (ping)', async () => (await cloudinary.api.ping()).status);
await step('upload image', async () => (await store.upload(png, { publicId: `${root}/img`, resourceType: 'image', overwrite: true })).url);
await step('image delivery f_auto,q_auto', async () => { const u = store.url(`${root}/img`, { tx: { transformation: [{ width: 64, crop: 'limit', fetch_format: 'auto', quality: 'auto' }] } }); const r = await fetch(u); if (!r.ok) throw new Error(`${r.status} ${u}`); return `${r.status} ${r.headers.get('content-type')}`; });
await step('upload audio (video resource)', async () => (await store.upload(wav, { publicId: `${root}/tone`, resourceType: 'video', overwrite: true })).url);
await step('audio derivative mp3 48k', async () => { const u = store.url(`${root}/tone`, { resourceType: 'video', tx: AUDIO_TX }); const r = await fetch(u); return `${r.status} ${r.headers.get('content-type')}`; });
await step('authenticated upload + private download URL', async () => {
  await store.upload(wav, { publicId: `${root}/private`, resourceType: 'video', type: 'authenticated', overwrite: true });
  const open = await fetch(store.url(`${root}/private`, { resourceType: 'video', type: 'authenticated' }));  // must be BLOCKED
  const info = await store.inspect(`${root}/private`, { resourceType: 'video', type: 'authenticated' });
  const dl = await fetch(store.privateDownloadUrl(`${root}/private`, { resourceType: 'video', type: 'authenticated', format: info.format }));
  if (open.ok) throw new Error('authenticated asset is publicly readable!');
  return `unsigned=${open.status} (blocked), signed download=${dl.status}`;
});
await step('signed browser upload params', async () => { const s = store.signUpload({ public_id: `${root}/x`, type: 'authenticated' }); return s.signature.length === 40 ? 'ok' : 'bad signature'; });
await step('delete', async () => { await store.destroy(`${root}/img`); await store.destroy(`${root}/tone`, { resourceType: 'video' }); await store.destroy(`${root}/private`, { resourceType: 'video', type: 'authenticated' }); return 'cleaned'; });

for (const [ok, name, d] of steps) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  ${ok ? '' : '->'} ${d}`);
process.exit(steps.every((s) => s[0]) ? 0 : 1);
