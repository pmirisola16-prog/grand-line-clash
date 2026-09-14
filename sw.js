// Alza il numero di versione a ogni deploy: forza l'aggiornamento sui telefoni
// dove l'app è già installata.
const CACHE = 'grandline-v10';
const FILES = ['./', './index.html', './manifest.json', './personaggi.csv',
               './icon-192.png', './icon-512.png', './icon-maskable-512.png',
               './GLTFLoader.js', './SkeletonUtils.js', './animazioni.glb',
               './knight.glb', './rogue.glb', './rogue-hooded.glb', './barbarian.glb', './mage.glb',
               './nave.glb', './palma.glb', './palma-corta.glb', './scoglio.glb', './cassa.glb'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // CDN e Firebase vanno diretti in rete
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
