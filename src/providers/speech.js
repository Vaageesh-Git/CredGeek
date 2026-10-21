// Speech providers behind one interface. Swap with TTS_PROVIDER / STT_PROVIDER.
//   tts.synthesize(text, lang) -> {buffer, format}      stt.transcribe(buffer, {lang, mime}) -> string
// Sarvam request shapes follow docs.sarvam.ai (checked Oct 2026). A BHASHINI adapter slots in the same way.
import { config } from '../config.js';

function wavTone(seconds) {
  const rate = 8000, n = Math.floor(rate * seconds), buf = Buffer.alloc(44 + n);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate, 28);
  buf.writeUInt16LE(1, 32); buf.writeUInt16LE(8, 34); buf.write('data', 36); buf.writeUInt32LE(n, 40);
  for (let i = 0; i < n; i++) buf[44 + i] = 128 + Math.round(20 * Math.sin((2 * Math.PI * 440 * i) / rate));
  return buf;
}

const mockTts = {
  name: 'mock',
  async synthesize(text) { return { buffer: wavTone(Math.min(3, 0.5 + text.length / 80)), format: 'wav' }; },
};
const mockStt = {
  name: 'mock',
  // Mock convention: the "audio" can literally be text bytes. Real audio -> fixed "yes".
  async transcribe(buffer) {
    const s = buffer.toString('utf8');
    return /^[\p{L}\p{N}\s,.?!'-]{1,200}$/u.test(s) ? s : 'yes';
  },
};

const sarvamTts = {
  name: 'sarvam',
  async synthesize(text, lang) {
    if (!config.sarvam.key) throw new Error('SARVAM_API_KEY missing');
    const r = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: { 'api-subscription-key': config.sarvam.key, 'content-type': 'application/json' },
      body: JSON.stringify({
        text, language_code: config.langCode[lang] || 'hi-IN', model: config.sarvam.ttsModel,
        speaker: config.sarvam.speaker, output_audio_codec: 'mp3', speech_sample_rate: 22050,
      }),
    });
    if (!r.ok) throw new Error(`Sarvam TTS ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    return { buffer: Buffer.from(j.audios[0], 'base64'), format: 'mp3' };
  },
};
const sarvamStt = {
  name: 'sarvam',
  async transcribe(buffer, { lang, mime = 'audio/webm' }) {
    if (!config.sarvam.key) throw new Error('SARVAM_API_KEY missing');
    const form = new FormData();
    form.append('file', new Blob([buffer], { type: mime }), 'answer.webm');
    form.append('model', config.sarvam.sttModel);
    form.append('language_code', config.langCode[lang] || 'unknown');
    const r = await fetch('https://api.sarvam.ai/speech-to-text', { method: 'POST', headers: { 'api-subscription-key': config.sarvam.key }, body: form });
    if (!r.ok) throw new Error(`Sarvam STT ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return (await r.json()).transcript || '';
  },
};

export const ttsProviders = { mock: mockTts, sarvam: sarvamTts };
export const sttProviders = { mock: mockStt, sarvam: sarvamStt };
export const getTts = () => ttsProviders[config.tts.provider] || mockTts;
export const getStt = () => sttProviders[config.stt.provider] || mockStt;
