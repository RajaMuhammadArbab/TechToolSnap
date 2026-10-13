// TechToolSnap PWA Service Worker
const CACHE_NAME = 'qth-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through fetch with cache fallback for offline readiness
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
