// Rule-based behaviour engine: reads signals, picks pace + mode + next step. Transparent and cheap (no LLM call).
import { lessons } from '../content/lessons.js';
import { hook, night } from '../content/misc.js';
import { ladderState, quarterOf, safetyDone } from './gamification.js';

const DAY = 86_400_000;

export function analyze(db, user, nowMs = Date.now()) {
  const id = user.id;
  const done = db.prepare('SELECT lesson_id, score, done_at FROM lesson_progress WHERE user_id=? ORDER BY done_at DESC').all(id);
  const doneIds = new Set(done.map((d) => d.lesson_id));
  const recent = done.slice(0, 3);
  const avgQuiz = recent.length ? recent.reduce((s, r) => s + r.score, 0) / recent.length : null;
  const daysSince = (nowMs - user.last_seen) / DAY;

  const ev = (t) => db.prepare("SELECT COUNT(*) AS n FROM events WHERE user_id=? AND type=? AND at>?").get(id, t, nowMs - 14 * DAY).n;
  const voiceUse = ev('tts_play') + ev('stt_use'), textUse = ev('lesson_view');
  const mode = voiceUse >= 3 && voiceUse >= textUse * 0.5 ? 'voice' : 'text';

  const pace = daysSince >= 3 ? 'gentle' : avgQuiz !== null && avgQuiz >= 0.8 && done.length >= 2 && daysSince < 2 ? 'fast' : 'steady';

  // Safety signals: an unhandled "someone asked for my papers" answer beats everything.
  const riskIds = night.filter((q) => q.risk).map((q) => q.id);
  const risk = db.prepare(`SELECT day, question_id, answer FROM night_answers WHERE user_id=? AND day>=? ORDER BY day DESC`).all(id, new Date(nowMs - 7 * DAY).toISOString().slice(0, 10))
    .find((a) => riskIds.includes(a.question_id) && night.find((q) => q.id === a.question_id).risk.includes(a.answer));
  const ladder = ladderState(db, id);
  const ownFile = ladder.find((r) => r.n === 2)?.status === 'done';
  const dueSafety = ownFile && !safetyDone(db, id, quarterOf(new Date(nowMs)));

  let next;
  if (risk && !safetyDone(db, id)) next = { type: 'safety', reason: 'papers_asked' };
  else if (avgQuiz !== null && avgQuiz < 0.5 && recent[0]) next = { type: 'lesson', id: recent[0].lesson_id, reason: 'review' };
  else {
    const hookLesson = hookLessonFor(user);
    const open = ladder.find((r) => r.status === 'open');
    const nextLesson = lessons.find((l) => !doneIds.has(l.id));
    if (hookLesson && !doneIds.has(hookLesson)) next = { type: 'lesson', id: hookLesson, reason: 'your_answer' };
    else if (open) next = { type: 'ladder', rung: open.n, reason: 'ready' };
    else if (dueSafety) next = { type: 'safety', reason: 'quarterly' };
    else if (nextLesson) next = { type: 'lesson', id: nextLesson.id, reason: pace === 'gentle' ? 'short_restart' : 'next' };
    else next = { type: 'game', id: pickGame(db, id), reason: 'practice' };
  }
  return { pace, mode, avgQuiz, daysSince: Math.round(daysSince * 10) / 10, risk: !!risk, next };
}

function hookLessonFor(user) {
  try {
    const picks = JSON.parse(user.hook_choice || '{}');
    for (const q of hook.questions) { const o = q.options.find((x) => x.id === picks[q.id]); if (o?.lesson) return o.lesson; }
  } catch { /* ignore */ }
  return null;
}

function pickGame(db, id) {
  const counts = Object.fromEntries(['kirana', 'trap', 'story'].map((g) => [g, db.prepare('SELECT COUNT(*) AS n FROM game_results WHERE user_id=? AND game=?').get(id, g).n]));
  return Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0]; // least-played first
}

export const NUDGE = {
  welcome_back: { en: 'Welcome back. Two minutes is enough today.', hi: 'वापस आने पर स्वागत है। आज बस दो मिनट काफ़ी हैं।' },
  review: { en: 'Let us look at that once more, a little slower.', hi: 'चलिए इसे एक बार और, थोड़ा धीरे से देखें।' },
  papers_asked: { en: 'You said someone asked for your papers. Let us do a quick check together.', hi: 'आपने बताया कि किसी ने आपके कागज़ माँगे। चलिए साथ में जल्दी जाँच करें।' },
  ready: { en: 'You are ready for the next rung.', hi: 'आप अगली सीढ़ी के लिए तैयार हैं।' },
  quarterly: { en: 'Time for your three-month check-up.', hi: 'आपकी तीन महीने की जाँच का समय है।' },
  your_answer: { en: 'Because of what you told us, start here.', hi: 'आपके जवाब के हिसाब से यहाँ से शुरू कीजिए।' },
  next: { en: 'Your next small step.', hi: 'आपका अगला छोटा कदम।' },
  practice: { en: 'Practice makes it stick.', hi: 'अभ्यास से बात पक्की होती है।' },
  short_restart: { en: 'Welcome back. Start small.', hi: 'वापस आने पर स्वागत है। छोटे से शुरू कीजिए।' },
};
