// Only one job: when a page cannot be loaded because there is no connection, show the offline page (with its small game)
// instead of the browser's error. Nothing else is cached or intercepted.
const OFF = new URL('offline.html', self.registration.scope).href
self.addEventListener('install', (e) => { e.waitUntil(caches.open('offline-v1').then((c) => c.add(new Request(OFF, { cache: 'reload' })))); self.skipWaiting() })
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== 'offline-v1').map((k) => caches.delete(k)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return
  e.respondWith(fetch(e.request).catch(() => caches.match(OFF)))
})
