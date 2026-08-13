/**
 * Inline Service Worker for lab 16.
 *
 * Registered from src/labs/16-service-worker-offline/Scenario.tsx via
 * `navigator.serviceWorker.register('/sw-lab.js', { scope: '/' })` on
 * mount, and unregistered on unmount.
 *
 * [TEACHING_BUG] cache-first strategy that never revalidates. Once the
 * /api/version response is cached, all future requests return the
 * cached value forever — so "publishing a new version" is invisible
 * to the page.
 */

const CACHE_NAME = 'sw-lab-cache-v1';
const VERSION_URL = '/api/version';

self.addEventListener('install', (event) => {
  // eslint-disable-next-line no-undef
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(VERSION_URL)).catch(() => {}),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname !== VERSION_URL) return; // only intercept /api/version

  // [TEACHING_BUG] cache-first: always serve cached version if present
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const fresh = await fetch(event.request);
      cache.put(event.request, fresh.clone());
      return fresh;
    }),
  );
});
