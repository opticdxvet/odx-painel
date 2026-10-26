// Guarda a página no iPhone para o emissor abrir sem internet. Ao publicar uma versão nova, troque o nome do cache.
const CACHE = "emissor-opticdx-1";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icone.png"];

self.addEventListener("install", evento => {
  evento.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", evento => {
  evento.waitUntil(caches.keys()
    .then(nomes => Promise.all(nomes.filter(nome => nome !== CACHE).map(nome => caches.delete(nome))))
    .then(() => self.clients.claim()));
});

// Rede primeiro (pega a versão nova quando há internet), cache quando está sem internet.
self.addEventListener("fetch", evento => {
  if (evento.request.method !== "GET") return;
  evento.respondWith(fetch(evento.request)
    .then(resposta => {
      const copia = resposta.clone();
      caches.open(CACHE).then(cache => cache.put(evento.request, copia));
      return resposta;
    })
    .catch(() => caches.match(evento.request, { ignoreSearch: true })));
});
