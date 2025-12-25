
const CACHE_NAME = 'finstudent-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache core assets
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Use a cache-first strategy for external libraries and local styles
  const isCachable = 
    event.request.url.includes('style.css') ||
    event.request.url.includes('cdn.tailwindcss.com') || 
    event.request.url.includes('esm.sh') || 
    event.request.url.includes('fonts.googleapis.com');

  if (isCachable) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Network-first with cache fallback for app logic
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});