import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export class HttpError extends Error { constructor(status, msg, extra) { super(msg); this.status = status; this.extra = extra; } }

export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function parse(schema, data) {
  const r = schema.safeParse(data);
  if (!r.success) throw new HttpError(400, 'invalid_input', r.error.issues.slice(0, 3).map((i) => `${i.path.join('.')}: ${i.message}`));
  return r.data;
}

export function signToken(user) { return jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: '30d' }); }

export const auth = (db) => (req, _res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return next(new HttpError(401, 'login_required'));
  try {
    const { sub } = jwt.verify(h.slice(7), config.jwtSecret);
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(sub);
    if (!user) throw new Error('gone');
    req.user = user; next();
  } catch { next(new HttpError(401, 'login_required')); }
};

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message === 'invalid_input' || status < 500 ? err.message : 'server_error', detail: err.extra });
}
