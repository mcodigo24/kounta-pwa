/* Service worker de Kounta: la app funciona sin conexión.
 * - Instalación: guarda las páginas de la app y los scripts/estilos que cada una usa.
 * - /_next/static (archivos con hash): primero caché.
 * - Navegaciones y resto: primero red, con caché como respaldo sin conexión.
 * Subir VERSION invalida las cachés anteriores. */
const VERSION = "kounta-v1";
const PAGES = ["/", "/app", "/app/truco", "/app/generala", "/app/chinchon", "/app/diezmil", "/app/comodin"];
const EXTRA = ["/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/maskable-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

async function precache() {
  const cache = await caches.open(VERSION);
  const assets = new Set(EXTRA);

  await Promise.all(
    PAGES.map(async (path) => {
      try {
        const response = await fetch(path, { cache: "reload" });
        if (!response.ok) return;
        await cache.put(path, response.clone());
        const html = await response.text();
        for (const match of html.matchAll(/\/_next\/static\/[^"'\\\s)<>]+/g)) assets.add(match[0]);
      } catch {
        /* sin red durante la instalación: se cachea sobre la marcha */
      }
    }),
  );

  await Promise.all([...assets].map((url) => cache.add(url).catch(() => undefined)));
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname !== "/sw.js") {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = (await cache.match(request)) || (await cache.match(request, { ignoreSearch: true }));
    if (cached) return cached;
    if (request.mode === "navigate") {
      const shell = await cache.match("/app");
      if (shell) return shell;
    }
    throw error;
  }
}
