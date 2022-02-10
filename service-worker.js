importScripts("/snews/precache-manifest.cad9a8e883e383e682076f462ccd6b03.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* eslint-disable no-undef */
if (workbox) {
  console.log(`Workbox is loaded 🎉`);
} else {
  console.log(`Workbox didn't load `);
}

workbox.setConfig({ debug: true });

// eslint-disable-next-line
workbox.precaching.precacheAndRoute(self.__precacheManifest);
// eslint-disable-next-line
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
// eslint-disable-next-line
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
// app-shell
workbox.routing.registerRoute("/", new workbox.strategies.NetworkFirst());


/**
 * Chache all feed RSS 
 */
workbox.routing.registerRoute(
  new RegExp(`^https://api.allorigins.win`),
  new workbox.strategies.CacheFirst({
    cacheName: 'feed-rss',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 0.5, // 1/2 Day
        maxEntries: 10,
      }),
    ],
  })
);


