// Gamification rules. Principles: reward real actions, never spending; pause, never reset; no public ranking.
import { now } from '../db.js';
import { rungs } from '../content/misc.js';
import { lessons } from '../content/lessons.js';

export const COIN = { lesson: 20, game: 15, night: 5, safety: 30, rung: 50, tree: 10 };
const DAILY_COIN_CAP = 150; // stops grinding; learning is paced, not farmed

const dayStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const quarterOf = (d = new Date()) => `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export function award(db, userId, kind) {
  const base = COIN[kind] ?? 0;
  const today = db.prepare("SELECT COALESCE(SUM(value),0) AS s FROM events WHERE user_id=? AND type='coin' AND at>=?").get(userId, dayStart()).s;
  const amt = Math.max(0, Math.min(base, DAILY_COIN_CAP - today));
  if (amt > 0) {
    db.prepare("INSERT INTO events (user_id,type,ref,value,at) VALUES (?, 'coin', ?, ?, ?)").run(userId, kind, amt, now());
    db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(amt, userId);
  }
  return amt;
}

export function giveBadge(db, userId, badge) {
  const r = db.prepare('INSERT OR IGNORE INTO badges (user_id,badge,at) VALUES (?,?,?)').run(userId, badge, now());
  return r.changes > 0;
}

export function track(db, userId, type, ref = null, value = null, meta = null) {
  db.prepare('INSERT INTO events (user_id,type,ref,value,meta,at) VALUES (?,?,?,?,?,?)').run(userId, type, ref, value, meta ? JSON.stringify(meta) : null, now());
  db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').run(now(), userId);
}

// Score Tree: one ring per on-time month. A missed month PAUSES growth (never removes rings).
export function treeSummary(db, userId) {
  const rows = db.prepare('SELECT month, status FROM score_tree WHERE user_id=? ORDER BY month').all(userId);
  const rings = rows.filter((r) => r.status === 'on_time').length;
  const last = rows.at(-1);
  const stage = rings === 0 ? 'seed' : rings < 3 ? 'sprout' : rings < 6 ? 'sapling' : 'tree';
  return { rings, stage, paused: last?.status === 'missed', months: rows, readyForScore: rings >= 6 };
}

export function recordMonth(db, userId, month, status) {
  db.prepare('INSERT INTO score_tree (user_id,month,status) VALUES (?,?,?) ON CONFLICT(user_id,month) DO UPDATE SET status=excluded.status').run(userId, month, status);
  const t = treeSummary(db, userId);
  const out = { tree: t, badges: [], coins: 0 };
  if (status === 'on_time') out.coins = award(db, userId, 'tree');
  if (t.readyForScore && giveBadge(db, userId, 'full_tree')) out.badges.push('full_tree');
  return out;
}

export function safetyDone(db, userId, quarter = quarterOf()) {
  const n = db.prepare('SELECT COUNT(*) AS n FROM safety_checks WHERE user_id=? AND quarter=?').get(userId, quarter).n;
  return n >= 3;
}

export function ladderState(db, userId) {
  const done = new Map(db.prepare('SELECT rung, done_at, confirmed_by FROM ladder WHERE user_id=?').all(userId).map((r) => [r.rung, r]));
  const lessonsDone = db.prepare('SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id=?').get(userId).n;
  const played = new Set(db.prepare('SELECT DISTINCT game FROM game_results WHERE user_id=?').all(userId).map((r) => r.game));
  const tree = treeSummary(db, userId);
  return rungs.map((r) => {
    const d = done.get(r.n);
    const prevDone = r.n === 0 || done.has(r.n - 1);
    const g = r.gate;
    const missing = [];
    if (g.lessons && lessonsDone < g.lessons) missing.push({ need: 'lessons', have: lessonsDone, want: g.lessons });
    if (g.game && !played.has(g.game)) missing.push({ need: 'game', game: g.game });
    if (g.treeMonths && tree.rings < g.treeMonths) missing.push({ need: 'treeMonths', have: tree.rings, want: g.treeMonths });
    if (g.safetyCheck && !safetyDone(db, userId)) missing.push({ need: 'safetyCheck' });
    const status = d ? 'done' : !prevDone ? 'locked' : missing.length ? 'preparing' : 'open';
    return { n: r.n, id: r.id, status, missing, confirmedBy: d?.confirmed_by ?? null };
  });
}

export function completeRung(db, userId, n) {
  const st = ladderState(db, userId).find((r) => r.n === n);
  if (!st) return { ok: false, error: 'no_such_rung' };
  if (st.status === 'done') return { ok: true, already: true };
  if (st.status !== 'open') return { ok: false, error: st.status, missing: st.missing };
  db.prepare("INSERT INTO ladder (user_id,rung,done_at,confirmed_by) VALUES (?,?,?,'self')").run(userId, n, now());
  const badges = []; if (giveBadge(db, userId, `rung_${n}`)) badges.push(`rung_${n}`);
  return { ok: true, coins: award(db, userId, 'rung'), badges };
}

export const lessonsDoneCount = (db, userId) => db.prepare('SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id=?').get(userId).n;
export const totalLessons = lessons.length;
