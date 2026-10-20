// MediaStore: the ONLY place that talks to Cloudinary. Everything else uses this interface,
// so the app logic is testable offline (MockStore) while production always runs CloudinaryStore.
//
// Interface
//   upload(buffer, {publicId, resourceType, type, tags, context, overwrite, notificationUrl}) -> {publicId, bytes, url}
//   inspect(publicId, {resourceType, type}) -> {bytes, duration, format, createdAt} | null
//   url(publicId, {resourceType, type, tx}) -> string          (CDN delivery URL)
//   privateDownloadUrl(publicId, {resourceType, type, format, ttlSec}) -> string (short-lived)
//   destroy(publicId, {resourceType, type})
//   destroyPrefix(prefix, {resourceType, type})
//   listByPrefix(prefix, {resourceType, type}) -> [{publicId, createdAt}]
//   signUpload(params) -> {signature, timestamp, apiKey, cloudName, params}
//   verifyWebhook(rawBody, timestamp, signature) -> boolean
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';

const SECS = (n) => Math.floor(Date.now() / 1000) + n;

export class CloudinaryStore {
  constructor(cfg = config.cloudinary) {
    this.cfg = cfg;
    cloudinary.config({ cloud_name: cfg.cloudName, api_key: cfg.apiKey, api_secret: cfg.apiSecret, secure: true });
  }

  upload(buffer, { publicId, resourceType = 'image', type = 'upload', tags = [], context, overwrite = false, notificationUrl, eager, format }) {
    return new Promise((resolve, reject) => {
      const opts = {
        public_id: publicId, resource_type: resourceType, type, tags, overwrite,
        unique_filename: false, use_filename: false, invalidate: overwrite,
      };
      if (format) opts.format = format;
      if (context) opts.context = context;
      if (notificationUrl) opts.notification_url = notificationUrl;
      if (eager) { opts.eager = eager; opts.eager_async = true; } // pre-build delivery derivatives off the request path
      cloudinary.uploader.upload_stream(opts, (err, res) => {
        if (err) return reject(err);
        resolve({ publicId: res.public_id, bytes: res.bytes, url: res.secure_url, existing: !!res.existing });
      }).end(buffer);
    });
  }

  async inspect(publicId, { resourceType = 'image', type = 'upload' } = {}) {
    try {
      const r = await cloudinary.api.resource(publicId, { resource_type: resourceType, type });
      return { bytes: r.bytes, duration: r.duration ?? null, format: r.format, createdAt: Date.parse(r.created_at) };
    } catch (e) {
      if (e?.error?.http_code === 404 || e?.http_code === 404) return null;
      throw e;
    }
  }

  url(publicId, { resourceType = 'image', type = 'upload', tx = {} } = {}) {
    return cloudinary.url(publicId, { resource_type: resourceType, type, secure: true, analytics: false, ...tx });
  }

  privateDownloadUrl(publicId, { resourceType = 'video', type = 'authenticated', format, ttlSec = 120 }) {
    return cloudinary.utils.private_download_url(publicId, format, { resource_type: resourceType, type, expires_at: SECS(ttlSec) });
  }

  async destroy(publicId, { resourceType = 'image', type = 'upload' } = {}) {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, type, invalidate: true });
  }

  async destroyPrefix(prefix, { resourceType = 'video', type = 'authenticated' } = {}) {
    await cloudinary.api.delete_resources_by_prefix(prefix, { resource_type: resourceType, type, invalidate: true });
  }

  async listByPrefix(prefix, { resourceType = 'video', type = 'authenticated' } = {}) {
    const out = [];
    let next;
    do {
      const r = await cloudinary.api.resources({ resource_type: resourceType, type, prefix, max_results: 100, next_cursor: next });
      for (const x of r.resources) out.push({ publicId: x.public_id, createdAt: Date.parse(x.created_at) });
      next = r.next_cursor;
    } while (next);
    return out;
  }

  // Signed direct-from-browser upload. Every param the browser sends (except file/api_key/resource_type/cloud_name) must be signed.
  signUpload(params) {
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = { ...params, timestamp };
    const signature = cloudinary.utils.api_sign_request(toSign, this.cfg.apiSecret);
    return { signature, timestamp, apiKey: this.cfg.apiKey, cloudName: this.cfg.cloudName, params: toSign };
  }

  verifyWebhook(rawBody, timestamp, signature) {
    try { return !!cloudinary.utils.verifyNotificationSignature(rawBody, Number(timestamp), signature); }
    catch { return false; }
  }
}

// ---------------------------------------------------------------------------------------------
// MockStore: disk-backed stand-in with the same contract. Dev/tests only (config refuses it in prod).
export class MockStore {
  constructor(cfg = config.cloudinary, dir = path.resolve('.data/mock-cdn')) {
    this.dir = dir; this.secret = 'mock-secret'; this.cfg = cfg;
    fs.mkdirSync(dir, { recursive: true });
  }
  _file(publicId, type) { return path.join(this.dir, type, ...publicId.split('/')); }
  async upload(buffer, { publicId, type = 'upload', overwrite = false }) {
    const f = this._file(publicId, type);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    const existing = fs.existsSync(f);
    if (!existing || overwrite) fs.writeFileSync(f, buffer);
    return { publicId, bytes: buffer.length, url: this.url(publicId, { type }), existing };
  }
  async inspect(publicId, { type = 'upload' } = {}) {
    const f = this._file(publicId, type);
    if (!fs.existsSync(f)) return null;
    const st = fs.statSync(f);
    return { bytes: st.size, duration: 3, format: 'webm', createdAt: st.mtimeMs };
  }
  url(publicId, { type = 'upload' } = {}) { return `/mock-cdn/${type}/${publicId}`; }
  privateDownloadUrl(publicId, { type = 'authenticated' }) { return this.url(publicId, { type }); }
  async fetchBytes(publicId, type) { return fs.readFileSync(this._file(publicId, type)); }
  async destroy(publicId, { type = 'upload' } = {}) { fs.rmSync(this._file(publicId, type), { force: true }); }
  async destroyPrefix(prefix, { type = 'authenticated' } = {}) { fs.rmSync(path.join(this.dir, type, prefix), { recursive: true, force: true }); }
  async listByPrefix(prefix, { type = 'authenticated' } = {}) {
    const root = path.join(this.dir, type, prefix); const out = [];
    const walk = (d) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else out.push({ publicId: path.relative(path.join(this.dir, type), p).split(path.sep).join('/'), createdAt: fs.statSync(p).mtimeMs });
    } };
    walk(root); return out;
  }
  signUpload(params) {
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = { ...params, timestamp };
    const s = Object.keys(toSign).sort().map((k) => `${k}=${toSign[k]}`).join('&');
    return { signature: crypto.createHash('sha1').update(s + this.secret).digest('hex'), timestamp, apiKey: 'mock', cloudName: 'mock', params: toSign, mock: true };
  }
  verifyWebhook(rawBody, timestamp, signature) {
    return crypto.createHash('sha1').update(rawBody + timestamp + this.secret).digest('hex') === signature;
  }
}

let singleton;
export function getStore() {
  if (!singleton) singleton = config.cloudinary.mock ? new MockStore() : new CloudinaryStore();
  return singleton;
}
export function setStore(s) { singleton = s; }
