import express from 'express';
import { getStore } from '../cloudinary/store.js';
import { recordUploadNotification } from '../cloudinary/voice.js';

// Cloudinary notification webhook. Signature is verified over the RAW body + timestamp; unsigned/stale calls are rejected.
export function webhookRouter(db) {
  const r = express.Router();
  r.post('/cloudinary', express.raw({ type: () => true, limit: '100kb' }), (req, res) => {
    const raw = req.body.toString('utf8');
    const ts = req.header('x-cld-timestamp'), sig = req.header('x-cld-signature');
    if (!ts || !sig || Math.abs(Date.now() / 1000 - Number(ts)) > 7200 || !getStore().verifyWebhook(raw, ts, sig)) return res.status(401).end();
    try { recordUploadNotification(db, JSON.parse(raw)); } catch { /* malformed body: acknowledge anyway so Cloudinary does not retry */ }
    res.status(200).end();
  });
  return r;
}
