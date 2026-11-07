// Service Worker: instalación, actualización, caché offline y notificaciones locales.
const CACHE = 'alerta-campus-v6';
const APP_SHELL = [
  './', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png',
  './imag1.png', './image2.png', './image3.png', './image4.png', './image5.png', './image6.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Los datos se conservan en IndexedDB y la API se sincroniza sólo con red.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // Network-first mantiene actualizados HTML y recursos. Si falta red, usa la caché.
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(async () => (await caches.match(event.request)) || (await caches.match('./index.html'))));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    const open = windows.find(client => 'focus' in client);
    return open ? open.focus() : clients.openWindow(event.notification.data?.url || './index.html');
  }));
});
