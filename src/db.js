import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

export function openDb(file = config.dbPath) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, nick TEXT UNIQUE NOT NULL, pin_hash TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'hi',
      mode TEXT NOT NULL DEFAULT 'text', hook_choice TEXT, coins INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL, last_seen INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL, ref TEXT, value REAL, meta TEXT, at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS ix_events_user_at ON events(user_id, at);
    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id TEXT NOT NULL,
      score REAL NOT NULL, done_at INTEGER NOT NULL, PRIMARY KEY (user_id, lesson_id)
    );
    CREATE TABLE IF NOT EXISTS game_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game TEXT NOT NULL, score REAL NOT NULL, at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ladder (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, rung INTEGER NOT NULL,
      done_at INTEGER NOT NULL, confirmed_by TEXT NOT NULL DEFAULT 'self', PRIMARY KEY (user_id, rung)
    );
    CREATE TABLE IF NOT EXISTS score_tree (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, month TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('on_time','missed')), PRIMARY KEY (user_id, month)
    );
    CREATE TABLE IF NOT EXISTS badges (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, badge TEXT NOT NULL, at INTEGER NOT NULL,
      PRIMARY KEY (user_id, badge)
    );
    CREATE TABLE IF NOT EXISTS safety_checks (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, quarter TEXT NOT NULL, step TEXT NOT NULL,
      outcome TEXT NOT NULL CHECK (outcome IN ('familiar','unfamiliar')), at INTEGER NOT NULL,
      PRIMARY KEY (user_id, quarter, step)
    );
    CREATE TABLE IF NOT EXISTS night_answers (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, day TEXT NOT NULL, question_id TEXT NOT NULL,
      answer TEXT NOT NULL, PRIMARY KEY (user_id, day)
    );
    -- Cloudinary bookkeeping. tts_cache = text->asset so we never pay TTS twice; assets = voice uploads awaiting cleanup.
    CREATE TABLE IF NOT EXISTS tts_cache (
      key TEXT PRIMARY KEY, public_id TEXT NOT NULL, lang TEXT NOT NULL, bytes INTEGER, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS assets (
      public_id TEXT PRIMARY KEY, user_id TEXT, kind TEXT NOT NULL, resource_type TEXT NOT NULL, type TEXT NOT NULL,
      bytes INTEGER, duration REAL, format TEXT, status TEXT NOT NULL DEFAULT 'signed', created_at INTEGER NOT NULL
    );
  `);
  return db;
}

export const now = () => Date.now();
