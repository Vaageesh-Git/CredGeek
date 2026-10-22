import test from 'node:test';
import assert from 'node:assert/strict';
import { boot } from './helpers.js';
import { lessons } from '../src/content/lessons.js';
import { trap } from '../src/content/games.js';

test('auth: register, login, duplicate, bad pin', async () => {
  const { call, close } = await boot();
  const r = await call('POST', '/api/auth/register', { nick: 'asha_1', pin: '4821', lang: 'hi' });
  assert.equal(r.status, 201);
  assert.equal((await call('POST', '/api/auth/register', { nick: 'asha_1', pin: '4821' })).status, 409);
  assert.equal((await call('POST', '/api/auth/login', { nick: 'asha_1', pin: '1111' })).status, 401);
  assert.equal((await call('POST', '/api/auth/login', { nick: 'asha_1', pin: '4821' })).status, 200);
  assert.equal((await call('POST', '/api/auth/register', { nick: 'x', pin: 'abcd' })).status, 400);
  assert.equal((await call('GET', '/api/me')).status, 401);
  close();
});

test('lessons: server scores quiz, rewards once, badge, localised', async () => {
  const { call, user, close } = await boot();
  const { token } = await user('hi');
  const l = await call('GET', '/api/lessons/L1', null, token);
  assert.match(l.json.title, /[ऀ-ॿ]/);
  const a = await call('POST', '/api/lessons/L1/complete', { answers: lessons[0].correct }, token);
  assert.equal(a.json.score, 1); assert.equal(a.json.coins, 20); assert.deepEqual(a.json.badges, ['first_step']);
  const b = await call('POST', '/api/lessons/L1/complete', { answers: [0, 1] }, token); // retry, worse
  assert.equal(b.json.coins, 0);
  assert.equal((await call('GET', '/api/me', null, token)).json.coins, 20);
  assert.equal((await call('POST', '/api/lessons/L1/complete', { answers: [1] }, token)).status, 400);
  close();
});

test('coins have a daily cap (no grinding)', async () => {
  const { call, user, close } = await boot();
  const { token } = await user();
  let total = 0;
  for (const l of lessons) total += (await call('POST', `/api/lessons/${l.id}/complete`, { answers: l.correct }, token)).json.coins;
  for (let i = 0; i < 20; i++) total += (await call('POST', '/api/games/trap', { answers: {} }, token)).json.coins;
  assert.ok(total <= 150, `awarded ${total}`);
  close();
});

test('games are scored on the server', async () => {
  const { call, user, close } = await boot();
  const { token } = await user();
  const perfect = Object.fromEntries(trap.offers.map((o) => [o.id, o.trap]));
  const t = await call('POST', '/api/games/trap', { answers: perfect }, token);
  assert.equal(t.json.score, 1); assert.ok(t.json.badges.includes('trap_spotter'));
  assert.ok(t.json.review.every((x) => x.clue));
  const k = await call('POST', '/api/games/kirana', { items: ['atta', 'oil', 'dal', 'books', 'pot'] }, token);
  assert.equal(k.json.score, 1); assert.equal(k.json.total, 960);
  const k2 = await call('POST', '/api/games/kirana', { items: ['speaker', 'toy', 'chips'] }, token);
  assert.equal(k2.json.needsOk, false);
  const s = await call('POST', '/api/games/story', { answers: { s1: 'b', s2: 'b' } }, token);
  assert.equal(s.json.score, 1);
  close();
});

test('ladder gating, score tree auto-completes rung 4, safety needed for rung 5', async () => {
  const { call, user, close } = await boot();
  const { token } = await user();
  assert.equal((await call('POST', '/api/ladder/0/complete', null, token)).status, 409); // gate: 3 lessons
  for (const l of lessons.slice(0, 5)) await call('POST', `/api/lessons/${l.id}/complete`, { answers: l.correct }, token);
  assert.equal((await call('POST', '/api/ladder/0/complete', null, token)).status, 200);
  assert.equal((await call('POST', '/api/ladder/2/complete', null, token)).status, 409); // locked
  await call('POST', '/api/games/kirana', { items: ['atta'] }, token);
  await call('POST', '/api/games/trap', { answers: {} }, token);
  for (const n of [1, 2, 3]) assert.equal((await call('POST', `/api/ladder/${n}/complete`, null, token)).status, 200, `rung ${n}`);
  for (const m of ['01', '02', '03', '04', '05']) await call('POST', '/api/tree', { month: `2027-${m}`, status: 'on_time' }, token);
  await call('POST', '/api/tree', { month: '2027-06', status: 'missed' }, token);
  let me = (await call('GET', '/api/me', null, token)).json;
  assert.equal(me.tree.rings, 5); assert.equal(me.tree.paused, true); assert.equal(me.tree.stage, 'sapling'); // paused, not reset
  const t = await call('POST', '/api/tree', { month: '2027-07', status: 'on_time' }, token);
  assert.equal(t.json.tree.rings, 6); assert.ok(t.json.badges.includes('full_tree'));
  me = (await call('GET', '/api/me', null, token)).json;
  assert.equal(me.ladder[4].status, 'done');
  assert.equal(me.ladder[5].status, 'preparing');
  for (const s of ['aadhaar', 'sims', 'report']) await call('POST', `/api/safety/${s}`, { outcome: 'familiar' }, token);
  me = (await call('GET', '/api/me', null, token)).json;
  assert.equal(me.ladder[5].status, 'open');
  assert.ok(me.badges.some((b) => b.id === 'detective'));
  close();
});

test('safety: unfamiliar outcome returns real help (181 / 15100), no detective badge', async () => {
  const { call, user, close } = await boot();
  const { token } = await user('en');
  await call('POST', '/api/safety/aadhaar', { outcome: 'unfamiliar' }, token);
  await call('POST', '/api/safety/sims', { outcome: 'familiar' }, token);
  const r = await call('POST', '/api/safety/report', { outcome: 'familiar' }, token);
  assert.ok(r.json.complete); assert.equal(r.json.badges.length, 0);
  assert.ok(r.json.help.some((h) => h.includes('181')) && r.json.help.some((h) => h.includes('15100')));
  close();
});

test('night question: optional, one a day, risky answer reroutes the journey to safety', async () => {
  const { call, user, close, db } = await boot();
  const { token } = await user();
  const q = (await call('GET', '/api/night', null, token)).json;
  assert.equal(q.answered, false);
  // force the risk question
  const day = new Date().toISOString().slice(0, 10);
  const uid = db.prepare('SELECT id FROM users LIMIT 1').get().id;
  db.prepare('INSERT OR REPLACE INTO night_answers (user_id,day,question_id,answer) VALUES (?,?,?,?)').run(uid, day, 'n_papers', 'yes');
  const j = await call('GET', '/api/journey/next', null, token);
  assert.equal(j.json.next.type, 'safety'); assert.equal(j.json.next.reason, 'papers_asked'); assert.equal(j.json.risk, true);
  assert.equal((await call('GET', '/api/night', null, token)).json.answered, true);
  close();
});

test('behaviour: hook answer picks first lesson; low quiz triggers gentle review', async () => {
  const { call, user, close } = await boot();
  const { token } = await user();
  await call('POST', '/api/me/hook', { answers: { h_want: 'no' } }, token);
  assert.equal((await call('GET', '/api/journey/next', null, token)).json.next.id, 'L2');
  await call('POST', '/api/lessons/L2/complete', { answers: [1, 0] }, token); // both wrong
  const j = (await call('GET', '/api/journey/next', null, token)).json;
  assert.deepEqual([j.next.type, j.next.id, j.next.reason], ['lesson', 'L2', 'review']);
  close();
});

test('voice intent matches English and Hindi/Hinglish answers', async () => {
  const { matchAnswer } = await import('../src/engine/voiceIntent.js');
  assert.equal(matchAnswer('haan ji', ['yes', 'no', 'unsure']), 'yes');
  assert.equal(matchAnswer('नहीं', ['yes', 'no', 'unsure']), 'no');
  assert.equal(matchAnswer('pata nahi', ['yes', 'no', 'unsure']), 'unsure');
  assert.equal(matchAnswer('hmm', ['yes', 'no']), null);
  assert.equal(matchAnswer('often', ['often', 'sometimes', 'no']), 'often');
});

test('delete my data removes the account', async () => {
  const { call, user, close } = await boot();
  const { token } = await user();
  assert.equal((await call('DELETE', '/api/me', null, token)).status, 204);
  assert.equal((await call('GET', '/api/me', null, token)).status, 401);
  close();
});
