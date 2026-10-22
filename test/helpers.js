process.env.CLOUDINARY_MOCK = '1';
process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';
import fs from 'node:fs';
import { after } from 'node:test';
import os from 'node:os';
import path from 'node:path';
import { openDb } from '../src/db.js';
import { createApp } from '../src/app.js';
import { MockStore, setStore } from '../src/cloudinary/store.js';

export async function boot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cl-'));
  const store = new MockStore({}, dir);
  setStore(store);
  const db = openDb(':memory:');
  const server = createApp(db).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, url, body, token, raw) => {
    const res = await fetch(base + url, { method, headers: { ...(raw ? {} : { 'content-type': 'application/json' }), ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: raw ? body : body ? JSON.stringify(body) : undefined });
    const text = await res.text(); let json = null; try { json = JSON.parse(text); } catch {}
    return { status: res.status, json, text };
  };
  let n = 0;
  const user = async (lang = 'en') => {
    const nick = `user_${++n}_${Math.random().toString(36).slice(2, 6)}`;
    const r = await call('POST', '/api/auth/register', { nick, pin: '1234', lang });
    return { token: r.json.token, nick };
  };
  after(() => { server.close(); server.closeAllConnections(); }); // never leave a server open if a test throws
  return { db, store, base, call, user, close: () => { server.close(); server.closeAllConnections(); }, dir };
}
