import 'dotenv/config';

const env = process.env;
const prod = env.NODE_ENV === 'production';

function cloudinaryConfig() {
  const mock = env.CLOUDINARY_MOCK === '1';
  if (mock && prod) throw new Error('CLOUDINARY_MOCK=1 is refused in production. Cloudinary is mandatory.');
  if (mock) return { mock: true, rootFolder: env.CLOUDINARY_ROOT_FOLDER || 'credit-ladder' };

  let cloudName = env.CLOUDINARY_CLOUD_NAME, apiKey = env.CLOUDINARY_API_KEY, apiSecret = env.CLOUDINARY_API_SECRET;
  if (env.CLOUDINARY_URL) {
    const m = env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) throw new Error('CLOUDINARY_URL must look like cloudinary://KEY:SECRET@CLOUD_NAME');
    [, apiKey, apiSecret, cloudName] = m;
  }
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials missing. Set CLOUDINARY_URL (or the three CLOUDINARY_* vars). For offline dev only: CLOUDINARY_MOCK=1.');
  }
  return {
    mock: false, cloudName, apiKey, apiSecret,
    rootFolder: env.CLOUDINARY_ROOT_FOLDER || 'credit-ladder',
  };
}

export const config = {
  prod,
  port: Number(env.PORT || 3000),
  baseUrl: env.PUBLIC_BASE_URL || `http://localhost:${env.PORT || 3000}`,
  jwtSecret: (() => {
    const s = env.JWT_SECRET || '';
    if (prod && s.length < 32) throw new Error('JWT_SECRET must be at least 32 chars in production');
    return s || 'dev-only-secret-not-for-production-use-0123456789';
  })(),
  dbPath: env.DB_PATH || './.data/app.db',
  cloudinary: cloudinaryConfig(),
  voiceMaxAgeMin: Number(env.VOICE_MAX_AGE_MIN || 60),
  voice: { maxSeconds: 30, maxBytes: 2 * 1024 * 1024, formats: ['webm', 'ogg', 'm4a', 'mp4', 'mp3', 'wav'] },
  tts: { provider: env.TTS_PROVIDER || 'mock' },
  stt: { provider: env.STT_PROVIDER || 'mock' },
  sarvam: {
    key: env.SARVAM_API_KEY,
    ttsModel: env.SARVAM_TTS_MODEL || 'bulbul:v3',
    speaker: env.SARVAM_TTS_SPEAKER || 'shubh',
    sttModel: env.SARVAM_STT_MODEL || 'saaras:v3',
  },
  langs: ['en', 'hi'],
  langCode: { en: 'en-IN', hi: 'hi-IN' },
};
