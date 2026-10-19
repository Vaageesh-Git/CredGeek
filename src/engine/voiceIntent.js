// Maps a spoken transcript to one of the on-screen options. Keyword rules first (free); an LLM is deliberately NOT in this path.
const norm = (s) => s.toLowerCase().normalize('NFC').replace(/[.,!?;:"'।]/g, ' ').replace(/\s+/g, ' ').trim();
const UNSURE = ['not sure', 'maybe', 'dont know', "don't know", 'pata nahi', 'pata nahin', 'पता नहीं', 'शायद', 'shayad'];
const NO = ['no', 'nope', 'nahi', 'nahin', 'nai', 'na', 'नहीं', 'ना', 'नही'];
const YES = ['yes', 'yeah', 'yep', 'haan', 'han', 'ha', 'ji', 'हाँ', 'हां', 'जी', 'अक्सर', 'often', 'sometimes', 'कभी'];

export function matchAnswer(transcript, optionIds) {
  const t = norm(transcript || '');
  if (!t) return null;
  const has = (id) => optionIds.includes(id);
  if (has('unsure') && UNSURE.some((w) => t.includes(w))) return 'unsure';
  const toks = new Set(t.split(' '));
  if (has('no') && NO.some((w) => toks.has(w))) return 'no';
  for (const id of optionIds) if (toks.has(id)) return id;
  if (has('yes') && YES.some((w) => toks.has(w))) return 'yes';
  const numbers = { '1': 0, one: 0, ek: 0, 'एक': 0, '2': 1, two: 1, do: 1, 'दो': 1, '3': 2, three: 2, teen: 2, 'तीन': 2 };
  for (const w of toks) if (w in numbers && optionIds[numbers[w]]) return optionIds[numbers[w]];
  return null;
}
