const CACHE_NAME = 'worldcup-betting-v2';
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res =>
      res || fetch(event.request).catch(() => new Response(
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>离线</title><style>body{background:#0a0e1a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;text-align:center;padding:20px}</style></head><body><div><div style="font-size:64px">⚽</div><h2 style="color:#fbbf24">网络已断开</h2><p style="color:#9ca3af">请连接网络后刷新页面</p></div></body></html>',
        { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
      ))
    )
  );
});
