const CACHE_NAME = 'sandbox-world-v1';
const ASSETS = [
  '/',
  '/index.html',
];

// Install - cache semua assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate - hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch - serve dari cache dulu, fallback ke network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache response baru
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback
        return caches.match('/index.html');
      });
    })
  );
});

// Background sync - update cache kalau ada koneksi
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-data') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS);
      })
    );
  }
});
