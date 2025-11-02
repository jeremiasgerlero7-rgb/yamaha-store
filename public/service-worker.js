// public/service-worker.js - OPTIMIZADO
const CACHE_NAME = 'yamaha-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html' // Crear esta página
];

// Instalar SW y cachear recursos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activar inmediatamente
  );
});

// Activar SW y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché optimizada
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia Network First para API
  if (url.pathname.includes('/api/') || url.pathname.includes('/products')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cachear respuesta válida
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla, intentar desde cache
          return caches.match(request);
        })
    );
    return;
  }

  // Estrategia Cache First para imágenes
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          // Cachear solo si es exitosa
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Cache First para el resto
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});