// The ONLY strings that may be turned into audio. No endpoint synthesizes arbitrary text, so TTS cost cannot be abused.
import { lessons } from './lessons.js';
import { hook, night, safety } from './misc.js';
import { kirana, trap, stories } from './games.js';
import { config } from '../config.js';

const map = new Map();
function add(id, texts) { for (const lang of config.langs) map.set(`${id}|${lang}`, texts[lang]); }

for (const l of lessons) add(`lesson:${l.id}`, Object.fromEntries(config.langs.map((g) => [g, `${l.i18n[g].title}. ${l.i18n[g].story} ${l.i18n[g].takeaway}`])));
for (const q of hook.questions) add(`hook:${q.id}`, q.text);
for (const q of night) add(`night:${q.id}`, q.text);
for (const o of trap.offers) add(`trap:${o.id}`, Object.fromEntries(config.langs.map((g) => [g, `${o.text[g]}`])));
for (const s of stories) add(`story:${s.id}`, s.scene);
add('kirana:intro', kirana.intro);
for (const st of safety.steps) add(`safety:${st.id}`, Object.fromEntries(config.langs.map((g) => [g, `${st.title[g]}. ${st.how[g].join(' ')}`])));

export const speakableText = (id, lang) => map.get(`${id}|${lang}`) ?? null;
export const allSpeakables = () => [...map].map(([k, text]) => { const [id, lang] = k.split('|'); return { id, lang, text }; });
