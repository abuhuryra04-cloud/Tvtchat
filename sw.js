// TVT CHAT Service Worker v2
const CACHE = 'tvt-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

self.addEventListener('push', e => {
  if (!e.data) return;
  try {
    const d = e.data.json();
    e.waitUntil(
      self.registration.showNotification(d.title || 'TVT CHAT', {
        body: d.body || '',
        icon: d.icon || './icon.png',
        badge: './icon.png',
        vibrate: [200, 100, 200],
        data: d
      })
    );
  } catch(err) {}
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) if ('focus' in c) return c.focus();
      return clients.openWindow('./');
    })
  );
});
