const VERSION = '{{VERSION}}';

const appCache = `DOOEX-app-${VERSION}`;
const savedDoodlesCache = 'DOOEX-saved-doodles';

function updateCacheWithNetworkResponse(cache, request) {
  return fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });
}

function cacheThenNetwork(cache, request) {
  return cache.match(request).then((cacheResponse) => {
    if (cacheResponse) {
      return cacheResponse;
    }

    return updateCacheWithNetworkResponse(cache, request);
  });
}

function deleteOldCache(cacheNames) {
  return Promise.all(
    cacheNames
      .filter(cacheName => cacheName.startsWith('DOOEX'))
      .filter(cacheName => (cacheName !== appCache))
      .map(cacheName => caches.delete(cacheName))
  );
}

self.addEventListener('install', (e) => {
  const appUrls = [
    './',
    './css/index.css',
    './js/index.js',

    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css',
  ];

  const dataUrls = [
    './data/doodles-data.json',
    './data/doodles-meta.json',
  ];

  caches.open(appCache).then(cache => cache.addAll(dataUrls));

  e.waitUntil(
    caches.open(appCache).then(cache => cache.addAll(appUrls))
  );
});

self.addEventListener('activate', (e) => {
  self.clients.claim();

  e.waitUntil(
    caches.keys().then(deleteOldCache)
  );
});

self.addEventListener('fetch', (e) => {
  const requestUrl = new URL(e.request.url);

  /*
    replace cached data with new data, if any
    return [newly] cached data
  */
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.includes('/data/')) {
      e.respondWith(
        caches.open(appCache).then(cache => cacheThenNetwork(cache, e.request))
      );

      return;
    }

    /*
      TODO: cannot cache iframe resources - find abother way out
    */
    if (requestUrl.pathname.includes('/saved/')) {
      const resourceUrl = requestUrl.search.replace('?url=', '');
      const resourceRequest = new Request(resourceUrl, e.request);

      e.respondWith(
        caches.open(savedDoodlesCache).then(cache => cacheThenNetwork(cache, resourceRequest))
      );

      return;
    }
  }

  /*
    return cached assets, if any
    return [new] network data
  */
  e.respondWith(caches.match(e.request).then(response => (response || fetch(e.request))));
  return;

  /*
    log unknown requests
  */
  console.log(e.request.url);
});

self.addEventListener('message', (e) => {
  if (e.data.shouldUpdate) {
    self.skipWaiting();
  }
});
