import express from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { now } from '../db.js';
import { HttpError, wrap, parse, auth, signToken } from '../middleware/http.js';
import { lessons, lessonById } from '../content/lessons.js';
import { kirana, trap, stories } from '../content/games.js';
import { hook, night, rungs, safety, BADGES } from '../content/misc.js';
import { speakableText } from '../content/speakables.js';
import { ensureAudio } from '../cloudinary/audio.js';
import { imageSet } from '../cloudinary/images.js';
import { createVoiceUpload, transcribeVoice, deleteAllVoiceFor, VoiceError } from '../cloudinary/voice.js';
import { getStore } from '../cloudinary/store.js';
import { analyze, NUDGE } from '../engine/behaviour.js';
import { matchAnswer } from '../engine/voiceIntent.js';
import { award, giveBadge, track, ladderState, completeRung, treeSummary, recordMonth, quarterOf, dayKey } from '../engine/gamification.js';

const L = (o, lang) => o?.[lang] ?? o?.en;
const lim = (max, windowMs = 60_000) => rateLimit({ windowMs, limit: max, standardHeaders: 'draft-7', legacyHeaders: false });

function hashPin(pin, salt = crypto.randomBytes(16)) {
  const h = crypto.scryptSync(pin, salt, 32);
  return `${salt.toString('hex')}:${h.toString('hex')}`;
}
function checkPin(pin, stored) {
  const [s, h] = stored.split(':');
  const x = crypto.scryptSync(pin, Buffer.from(s, 'hex'), 32);
  return crypto.timingSafeEqual(x, Buffer.from(h, 'hex'));
}

export function apiRouter(db) {
  const r = express.Router();
  const needAuth = auth(db);
  const mustLang = (u, q) => (config.langs.includes(q) ? q : u?.lang || 'hi');

  // ---------- auth: nickname + PIN only. No phone, email, Aadhaar or PAN is ever collected. ----------
  const cred = z.object({ nick: z.string().regex(/^[a-z0-9_]{3,20}$/i), pin: z.string().regex(/^\d{4,6}$/), lang: z.enum(['en', 'hi']).optional() });
  r.post('/auth/register', lim(10), wrap((req, res) => {
    const b = parse(cred, req.body);
    const id = crypto.randomUUID();
    try {
      db.prepare('INSERT INTO users (id,nick,pin_hash,lang,created_at,last_seen) VALUES (?,?,?,?,?,?)').run(id, b.nick.toLowerCase(), hashPin(b.pin), b.lang || 'hi', now(), now());
    } catch { throw new HttpError(409, 'nick_taken'); }
    res.status(201).json({ token: signToken({ id }) });
  }));
  r.post('/auth/login', lim(10), wrap((req, res) => {
    const b = parse(cred.omit({ lang: true }), req.body);
    const u = db.prepare('SELECT * FROM users WHERE nick=?').get(b.nick.toLowerCase());
    if (!u || !checkPin(b.pin, u.pin_hash)) throw new HttpError(401, 'bad_login');
    res.json({ token: signToken(u) });
  }));

  r.get('/hook', wrap((req, res) => {
    const lang = mustLang(null, req.query.lang);
    res.json({ questions: hook.questions.map((q) => ({ id: q.id, text: L(q.text, lang), audio: `hook:${q.id}`, options: q.options.map((o) => ({ id: o.id, text: L(o.text, lang) })) })) });
  }));

  r.use(needAuth);

  const profile = (u) => {
    const lang = u.lang;
    const badges = db.prepare('SELECT badge FROM badges WHERE user_id=?').all(u.id).map((b) => ({ id: b.badge, name: L(BADGES[b.badge], lang), image: imageSet('badges', b.badge) }));
    return { nick: u.nick, lang, mode: u.mode, coins: u.coins, badges, tree: treeSummary(db, u.id), ladder: ladderState(db, u.id).map((s) => ({ ...s, title: L(rungs[s.n].title, lang), help: L(rungs[s.n].help, lang), image: imageSet('rungs', `rung_${s.n}`) })) };
  };
  r.get('/me', wrap((req, res) => res.json(profile(req.user))));
  r.patch('/me', wrap((req, res) => {
    const b = parse(z.object({ lang: z.enum(['en', 'hi']).optional(), mode: z.enum(['text', 'voice']).optional() }), req.body);
    if (b.lang) db.prepare('UPDATE users SET lang=? WHERE id=?').run(b.lang, req.user.id);
    if (b.mode) db.prepare('UPDATE users SET mode=? WHERE id=?').run(b.mode, req.user.id);
    res.json(profile(db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id)));
  }));
  r.delete('/me', wrap(async (req, res) => {
    await deleteAllVoiceFor(db, req.user.id); // Cloudinary first, then rows
    db.prepare('DELETE FROM users WHERE id=?').run(req.user.id);
    res.status(204).end();
  }));
  r.post('/me/hook', wrap((req, res) => {
    const b = parse(z.object({ answers: z.record(z.string(), z.string()) }), req.body);
    db.prepare('UPDATE users SET hook_choice=? WHERE id=?').run(JSON.stringify(b.answers), req.user.id);
    track(db, req.user.id, 'hook', null, null, b.answers);
    res.json({ ok: true });
  }));

  r.post('/events', wrap((req, res) => {
    const b = parse(z.object({ type: z.enum(['tts_play', 'lesson_view', 'app_open']), ref: z.string().max(40).optional() }), req.body);
    track(db, req.user.id, b.type, b.ref ?? null);
    res.json({ ok: true });
  }));

  // ---------- journey ----------
  r.get('/journey/next', wrap((req, res) => {
    const a = analyze(db, req.user);
    const lang = req.user.lang;
    if (a.mode !== req.user.mode) db.prepare('UPDATE users SET mode=? WHERE id=?').run(a.mode, req.user.id);
    const key = a.pace === 'gentle' && a.next.reason === 'next' ? 'welcome_back' : a.next.reason;
    res.json({ ...a, nudge: L(NUDGE[key] || NUDGE.next, lang) });
  }));

  // ---------- lessons ----------
  r.get('/lessons', wrap((req, res) => {
    const done = new Map(db.prepare('SELECT lesson_id, score FROM lesson_progress WHERE user_id=?').all(req.user.id).map((d) => [d.lesson_id, d.score]));
    res.json(lessons.map((l) => ({ id: l.id, order: l.order, title: l.i18n[req.user.lang].title, done: done.has(l.id), score: done.get(l.id) ?? null, image: imageSet('lessons', l.id) })));
  }));
  r.get('/lessons/:id', wrap(async (req, res) => {
    const l = lessonById[req.params.id]; if (!l) throw new HttpError(404, 'not_found');
    const c = l.i18n[req.user.lang];
    track(db, req.user.id, 'lesson_view', l.id);
    res.json({ id: l.id, title: c.title, story: c.story, takeaway: c.takeaway, action: c.action, image: imageSet('lessons', l.id), audioId: `lesson:${l.id}`,
      quiz: c.quiz.map((q) => ({ q: q.q, options: q.options })) });
  }));
  r.post('/lessons/:id/complete', wrap((req, res) => {
    const l = lessonById[req.params.id]; if (!l) throw new HttpError(404, 'not_found');
    const b = parse(z.object({ answers: z.array(z.number().int().min(0).max(3)).length(l.correct.length) }), req.body);
    const score = b.answers.filter((a, i) => a === l.correct[i]).length / l.correct.length;
    const first = !db.prepare('SELECT 1 FROM lesson_progress WHERE user_id=? AND lesson_id=?').get(req.user.id, l.id);
    db.prepare('INSERT INTO lesson_progress (user_id,lesson_id,score,done_at) VALUES (?,?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET score=MAX(score,excluded.score), done_at=excluded.done_at').run(req.user.id, l.id, score, now());
    track(db, req.user.id, 'quiz', l.id, score);
    const out = { score, correct: l.correct, takeaway: l.i18n[req.user.lang].takeaway, action: l.i18n[req.user.lang].action, coins: 0, badges: [] };
    if (first) { out.coins = award(db, req.user.id, 'lesson'); if (giveBadge(db, req.user.id, 'first_step')) out.badges.push('first_step'); }
    res.json(out);
  }));

  // ---------- audio: only known ids are synthesized (cost guard) ----------
  r.get('/audio/:id', lim(60), wrap(async (req, res) => {
    const lang = mustLang(req.user, req.query.lang);
    const text = speakableText(req.params.id, lang);
    if (!text) throw new HttpError(404, 'no_such_audio');
    try { const a = await ensureAudio(db, text, lang); track(db, req.user.id, 'tts_play', req.params.id); res.json({ url: a.url, cached: a.cached }); }
    catch (e) { console.error('tts failed', e.message); res.status(503).json({ error: 'audio_unavailable', fallback: 'text' }); } // app keeps working as text
  }));

  // ---------- games (server-side scoring) ----------
  const finishGame = (u, game, score, extraBadges = []) => {
    db.prepare('INSERT INTO game_results (user_id,game,score,at) VALUES (?,?,?,?)').run(u.id, game, score, now());
    track(db, u.id, 'game', game, score);
    const badges = []; for (const b of extraBadges) if (giveBadge(db, u.id, b)) badges.push(b);
    return { score, coins: award(db, u.id, 'game'), badges };
  };
  r.get('/games/kirana', (req, res) => res.json({ budget: kirana.budget, intro: L(kirana.intro, req.user.lang), audioId: 'kirana:intro', items: kirana.items.map((i) => ({ id: i.id, price: i.price, need: i.need, saving: !!i.saving, name: L(i.name, req.user.lang) })) }));
  r.post('/games/kirana', wrap((req, res) => {
    const { items } = parse(z.object({ items: z.array(z.string()).max(20) }), req.body);
    const picked = kirana.items.filter((i) => new Set(items).has(i.id));
    const total = picked.reduce((s, i) => s + i.price, 0);
    const needsOk = kirana.items.filter((i) => i.need).every((i) => picked.includes(i));
    const saved = picked.some((i) => i.saving), within = total <= kirana.budget;
    const score = (needsOk ? 0.5 : 0) + (within ? 0.3 : 0) + (saved ? 0.2 : 0);
    res.json({ ...finishGame(req.user, 'kirana', score, score === 1 ? ['basket_boss'] : []), total, needsOk, within, saved, takeaway: L(kirana.takeaway, req.user.lang) });
  }));
  r.get('/games/trap', (req, res) => res.json({ offers: trap.offers.map((o) => ({ id: o.id, text: L(o.text, req.user.lang), audioId: `trap:${o.id}` })) }));
  r.post('/games/trap', wrap((req, res) => {
    const { answers } = parse(z.object({ answers: z.record(z.string(), z.boolean()) }), req.body); // id -> "I think it is a trap"
    const review = trap.offers.map((o) => ({ id: o.id, correct: answers[o.id] === o.trap, isTrap: o.trap, clue: L(o.clue, req.user.lang) }));
    const score = review.filter((x) => x.correct).length / trap.offers.length;
    res.json({ ...finishGame(req.user, 'trap', score, score >= 0.85 ? ['trap_spotter'] : []), review, takeaway: L(trap.takeaway, req.user.lang) });
  }));
  r.get('/games/story', (req, res) => res.json({ stories: stories.map((s) => ({ id: s.id, scene: L(s.scene, req.user.lang), audioId: `story:${s.id}`, choices: s.choices.map((c) => ({ id: c.id, text: L(c.text, req.user.lang) })) })) }));
  r.post('/games/story', wrap((req, res) => {
    const { answers } = parse(z.object({ answers: z.record(z.string(), z.string()) }), req.body);
    const review = stories.map((s) => { const c = s.choices.find((x) => x.id === answers[s.id]); return { id: s.id, safe: !!c?.safe, result: c ? L(c.result, req.user.lang) : null }; });
    const score = review.filter((x) => x.safe).length / stories.length;
    res.json({ ...finishGame(req.user, 'story', score, score === 1 ? ['story_sharp'] : []), review });
  }));

  // ---------- night question: one optional tap, never blocks ----------
  r.get('/night', wrap((req, res) => {
    const day = dayKey();
    if (db.prepare('SELECT 1 FROM night_answers WHERE user_id=? AND day=?').get(req.user.id, day)) return res.json({ answered: true });
    const q = night[Math.floor(Date.now() / 86_400_000) % night.length];
    res.json({ answered: false, id: q.id, text: L(q.text, req.user.lang), options: q.options, audioId: `night:${q.id}` });
  }));
  r.post('/night', wrap((req, res) => {
    const b = parse(z.object({ questionId: z.string(), answer: z.string().max(20) }), req.body);
    const q = night.find((x) => x.id === b.questionId); if (!q || !q.options.includes(b.answer)) throw new HttpError(400, 'invalid_input');
    db.prepare('INSERT OR REPLACE INTO night_answers (user_id,day,question_id,answer) VALUES (?,?,?,?)').run(req.user.id, dayKey(), q.id, b.answer);
    track(db, req.user.id, 'night', q.id);
    res.json({ ok: true, coins: award(db, req.user.id, 'night'), risk: !!q.risk?.includes(b.answer) });
  }));

  // ---------- ladder, tree ----------
  r.get('/ladder', (req, res) => res.json(profile(req.user).ladder));
  r.post('/ladder/:n/complete', wrap((req, res) => {
    const out = completeRung(db, req.user.id, Number(req.params.n));
    if (!out.ok) throw new HttpError(409, out.error, out.missing);
    res.json(out);
  }));
  r.post('/tree', wrap((req, res) => {
    const b = parse(z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/), status: z.enum(['on_time', 'missed']) }), req.body);
    const out = recordMonth(db, req.user.id, b.month, b.status);
    if (out.tree.readyForScore) { const rung = ladderState(db, req.user.id).find((s) => s.n === 4); if (rung.status === 'open') completeRung(db, req.user.id, 4); }
    res.json(out);
  }));

  // ---------- safety check-up (official sites; the app stores only familiar/unfamiliar per step) ----------
  r.get('/safety', (req, res) => {
    const lang = req.user.lang, q = quarterOf();
    const rows = new Map(db.prepare('SELECT step, outcome FROM safety_checks WHERE user_id=? AND quarter=?').all(req.user.id, q).map((x) => [x.step, x.outcome]));
    res.json({ quarter: q, steps: safety.steps.map((s) => ({ id: s.id, url: s.url, title: L(s.title, lang), how: L(s.how, lang), audioId: `safety:${s.id}`, outcome: rows.get(s.id) ?? null })),
      help: rows.size === 3 && [...rows.values()].includes('unfamiliar') ? L(safety.unfamiliar, lang) : null,
      allFamiliar: rows.size === 3 && ![...rows.values()].includes('unfamiliar') ? L(safety.allFamiliar, lang) : null });
  });
  r.post('/safety/:step', wrap((req, res) => {
    const step = safety.steps.find((s) => s.id === req.params.step); if (!step) throw new HttpError(404, 'not_found');
    const { outcome } = parse(z.object({ outcome: z.enum(['familiar', 'unfamiliar']) }), req.body);
    const q = quarterOf();
    db.prepare('INSERT OR REPLACE INTO safety_checks (user_id,quarter,step,outcome,at) VALUES (?,?,?,?,?)').run(req.user.id, q, step.id, outcome, now());
    const rows = db.prepare('SELECT outcome FROM safety_checks WHERE user_id=? AND quarter=?').all(req.user.id, q);
    const out = { complete: rows.length === 3, coins: 0, badges: [] };
    if (out.complete) { out.coins = award(db, req.user.id, 'safety'); if (!rows.some((x) => x.outcome === 'unfamiliar') && giveBadge(db, req.user.id, 'detective')) out.badges.push('detective'); out.help = rows.some((x) => x.outcome === 'unfamiliar') ? L(safety.unfamiliar, req.user.lang) : L(safety.allFamiliar, req.user.lang); }
    res.json(out);
  }));

  // ---------- voice answers via Cloudinary ----------
  r.post('/voice/sign', lim(20), wrap((req, res) => res.json(createVoiceUpload(db, req.user.id))));
  r.post('/voice/mock-upload', express.raw({ type: () => true, limit: '2mb' }), wrap(async (req, res) => {
    if (!config.cloudinary.mock) throw new HttpError(404, 'not_found');
    const publicId = String(req.query.public_id || '');
    if (!db.prepare('SELECT 1 FROM assets WHERE public_id=? AND user_id=?').get(publicId, req.user.id)) throw new HttpError(403, 'forbidden');
    await getStore().upload(req.body, { publicId, resourceType: 'video', type: 'authenticated', overwrite: true });
    res.json({ ok: true });
  }));
  r.post('/voice/transcribe', lim(20), wrap(async (req, res) => {
    const b = parse(z.object({ publicId: z.string().max(200), optionIds: z.array(z.string()).max(8).optional() }), req.body);
    try {
      const { transcript } = await transcribeVoice(db, req.user.id, b.publicId, req.user.lang);
      track(db, req.user.id, 'stt_use');
      res.json({ transcript, match: b.optionIds ? matchAnswer(transcript, b.optionIds) : null });
    } catch (e) { if (e instanceof VoiceError) throw new HttpError(e.status, e.message); throw e; }
  }));

  return r;
}
