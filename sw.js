// A new version number to force the browser to update the service worker
const CACHE_NAME = 'japan-plan-v2';

// Caching only the most essential files to ensure a fast and successful installation
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './images/japanIcon.png'
];

// Install event: open the cache and add the core files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Attempting to install...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened, adding core files.');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Install successful.');
      })
  );
});

// Fetch event: serve from cache first, then fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
