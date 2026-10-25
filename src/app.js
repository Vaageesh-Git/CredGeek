import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { apiRouter } from './routes/api.js';
import { webhookRouter } from './routes/webhooks.js';
import { errorHandler } from './middleware/http.js';

import fs from 'node:fs';

// Mock CDN stores extension-less files like Cloudinary does, so sniff a content-type for the browser.
function mockTypes(res, file) {
  const fd = fs.openSync(file, 'r'); const b = Buffer.alloc(8); fs.readSync(fd, b, 0, 8, 0); fs.closeSync(fd);
  const head = b.toString('latin1');
  res.type(head.startsWith('<svg') ? 'image/svg+xml' : head.startsWith('RIFF') ? 'audio/wav' : head.startsWith('\x89PNG') ? 'image/png' : 'application/octet-stream');
}

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp(db) {
  const app = express();
  app.set('trust proxy', 1);
  const cld = ['https://res.cloudinary.com'];
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.use(helmet({ contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"], scriptSrc: ["'self'"],
    styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
    imgSrc: ["'self'", 'data:', ...cld], mediaSrc: ["'self'", 'blob:', ...cld],
    connectSrc: ["'self'", 'https://api.cloudinary.com', '*'], objectSrc: ["'none'"], frameAncestors: ["'none'"],
  } } }));
  app.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
  app.get('/api/health', (_q, r) => r.json({ ok: true, cloudinary: config.cloudinary.mock ? 'mock' : 'live' }));
  app.use('/api/webhooks', webhookRouter(db)); // raw body parsers live inside; must precede express.json
  // JSON parser everywhere except the raw-body mock upload (dev only)
  app.use((req, res, next) => (req.path === '/api/voice/mock-upload' ? next() : express.json({ limit: '50kb' })(req, res, next)));
  app.use('/api', apiRouter(db));
  if (config.cloudinary.mock) app.use('/mock-cdn/upload', express.static(path.resolve('.data/mock-cdn/upload'), { setHeaders: mockTypes }));
  app.use(express.static(path.join(here, '../public'), {
    maxAge: config.prod ? '1h' : 0,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('sw.js') || filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  app.use(errorHandler);
  return app;
}
