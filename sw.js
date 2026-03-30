const CACHE_NAME = "teacher-tools-creator-v1";

const URLS_TO_CACHE = [
  "/teacher-tools/",
  "/teacher-tools/index.html",
  "/teacher-tools/manifest.json",
  "/teacher-tools/creator/game-creator.html",
  "/teacher-tools/creator/game-creator.js",
  "/teacher-tools/database/content.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        }).catch(() => {
          return caches.match("/teacher-tools/index.html");
        })
      );
    })
  );
});