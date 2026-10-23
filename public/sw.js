// Offline shell + CDN media cache. API calls are never cached (always fresh, never stale personal data).
const SHELL = 'shell-v3', MEDIA = 'media-v3';
const FILES = ['/', '/style.css', '/app.js', '/icon.svg', '/manifest.webmanifest'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(SHELL).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => ![SHELL, MEDIA].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.startsWith('/api/')) return;
  const cdn = url.hostname === 'res.cloudinary.com' || url.pathname.startsWith('/mock-cdn/');
  if (cdn) {
    if (req.headers.has('range')) return; // partial responses cannot be cached; let the network handle them
    e.respondWith(caches.open(MEDIA).then(async (c) => {
      const hit = await c.match(req); if (hit) return hit;
      const res = await fetch(req);
      if (res.status === 200) { c.put(req, res.clone()); trim(c); }
      return res;
    }));
  } else if (url.origin === location.origin) {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(SHELL).then((c) => c.put(req, copy)); return r; }).catch(() => caches.match(req).then((r) => r || caches.match('/'))));
  }
});
async function trim(cache, max = 120) { const ks = await cache.keys(); for (let i = 0; i < ks.length - max; i++) await cache.delete(ks[i]); }
