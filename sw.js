/* Quick Skins service worker.
 * Two jobs:
 *   1) Catch CSV files shared into the installed app from the Android share
 *      sheet (Web Share Target), stash them, and hand off to the page.
 *   2) Offline support — WITHOUT trapping users on a stale build. Page loads
 *      are network-first (so app updates appear immediately), assets are
 *      stale-while-revalidate, and the cache is only a fallback when offline.
 */
const CACHE = "quick-skins-v6";
const SHARE_CACHE = "quick-skins-shared";
const SHARE_KEY = "./shared-csv-data";
const ASSETS = [
  "/",
  "/index.html",
  "/guide.html",
  "/manifest.webmanifest",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== CACHE && k !== SHARE_CACHE).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // 1) Shared file POST from the Android share sheet.
  if (req.method === "POST" && url.pathname.endsWith("/share-target")) {
    event.respondWith((async () => {
      try {
        const form = await req.formData();
        const file = form.get("file");
        const text = file && typeof file.text === "function" ? await file.text() : "";
        const cache = await caches.open(SHARE_CACHE);
        await cache.put(SHARE_KEY, new Response(text, { headers: { "Content-Type": "text/csv" } }));
      } catch (err) {
        /* if anything fails, fall through to the app empty-handed */
      }
      return Response.redirect(new URL("./?share=1", self.location.href).href, 303);
    })());
    return;
  }

  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Let the browser handle video range requests directly. This preserves
  // native streaming behavior and keeps large MP4 responses out of Cache API.
  if (req.headers.has("range") || url.pathname.toLowerCase().endsWith(".mp4")) return;

  // 2a) Page navigations: network-first so a new deploy shows up right away;
  //     fall back to the cached shell only when the network is unavailable.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      const pageKey = url.pathname === "/" ? "/" : url.pathname;
      const fallbackKey = pageKey === "/guide.html" ? "/guide.html" : "/index.html";
      try {
        const fresh = await fetch(req);
        if (pageKey === "/" || pageKey === "/index.html" || pageKey === "/guide.html") {
          caches.open(CACHE).then(c => c.put(pageKey, fresh.clone())).catch(() => {});
        }
        return fresh;
      } catch (err) {
        return (await caches.match(pageKey)) ||
          (await caches.match(fallbackKey)) ||
          (await caches.match("/")) ||
          Response.error();
      }
    })());
    return;
  }

  // 2b) Static assets: serve cache fast, refresh in the background.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then(resp => {
      if (resp && resp.ok) cache.put(req, resp.clone()).catch(() => {});
      return resp;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
