const CACHE_NAME = 'shoppwa-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bba24ee3-c275-4ba8-a259-aa1721e126f2.png',
  'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0e565ea2-1411-4b72-8032-1a67aa66aa3f.png',
  'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2a3d5d25-c8dd-40a2-bdf5-f0d8e2bb2d5f.png',
  'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cd524f69-4494-41ea-b30f-448a8c97ad8c.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(CACHE_URLS);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Cache-first with network fallback strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Cache new resources if they are for our app
            if (event.request.url.startsWith('http') && 
                (event.request.url.includes(location.host) || 
                 event.request.url.includes('placehold.co'))) {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // If network fails and no cached version available
            // For our app pages, return the cached index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: 'https://placehold.co/192x192?text=ShopPWA',
    badge: 'https://placehold.co/72x72?text=SP',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

