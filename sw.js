// Gia Bảo Personal OS — Service Worker
// Mục đích: (1) cho phép trình duyệt cài app (PWA installability),
// (2) cache app shell để mở lại nhanh / có thể dùng offline cơ bản.
// KHÔNG can thiệp vào logic app — chỉ cache tĩnh ở cấp network.

const CACHE_NAME = "giabao-os-v2";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Chiến lược: network-first cho index.html (luôn lấy bản mới nhất khi có mạng),
// cache-first cho các asset tĩnh khác (icon, manifest).
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isHTML =
    request.mode === "navigate" || url.pathname.endsWith("index.html");

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
    )
  );
});
