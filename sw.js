const CACHE_NAME = 'sas-archive-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './songs.json',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Noto+Sans+JP:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // 新しい SW をすぐに有効化（待機スキップ）
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 古いキャッシュ（v1 など）を削除
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
