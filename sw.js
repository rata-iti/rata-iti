// Service worker : permet d'installer l'app et de l'ouvrir hors ligne.
const CACHE = 'rata-iti-v3';
const FILES = ['./', './index.html', './style.css', './app.js', './i18n.js', './qrcode.js',
  './manifest.json', './icon.svg', './vaa.svg', './tapa.svg', './pattern.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Réseau d'abord (pour avoir la dernière version), cache si hors ligne
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Clic sur une notification : ouvrir l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(list => {
      if (list.length) return list[0].focus();
      return self.clients.openWindow('./');
    })
  );
});
