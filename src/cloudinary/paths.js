// One naming scheme for every asset. Prefixes make ownership checks and bulk deletes trivial.
import crypto from 'node:crypto';
import { config } from '../config.js';

const root = config.cloudinary.rootFolder;

export const paths = {
  root,
  ttsPrefix: `${root}/tts`,
  voicePrefix: (userId) => `${root}/voice/${userId}/`,
  voiceId: (userId) => `${root}/voice/${userId}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
  imagePrefix: `${root}/img`,
  imageId: (kind, name) => `${root}/img/${kind}/${name}`,
};

// Deterministic key: same words + same language + same voice = same asset, forever.
export function ttsKey(text, lang, voice = 'default') {
  const norm = text.normalize('NFC').replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(`${lang}|${voice}|${norm}`).digest('hex').slice(0, 32);
}
export const ttsPublicId = (key, lang) => `${paths.ttsPrefix}/${lang}/${key}`;
