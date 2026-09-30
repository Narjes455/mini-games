/* Service Worker: يخلي الألعاب تشتغل بدون نت بعد أول زيارة.
   يجيب النسخة الجديدة من النت أول، ولو ما فيه نت يستخدم المحفوظ.
   لما تضيفين لعبة جديدة، ضيفي ملفاتها في FILES وغيّري رقم CACHE. */
const CACHE = "mini-games-v1";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./guess-word/",
  "./guess-word/index.html",
  "./guess-word/words.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
