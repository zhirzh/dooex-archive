/*
  static always => cache:false, strategy:cache-first
    /saved/[remote-google-url]

  static always => cache:true, strategy:cache-first
    ./static/css/css/bootstrap.min.css
    ./static/fonts/fonts/glyphicons-halflings-regular.woff2

  static versioned => cache:true, strategy:cache-first
    ./favicon.ico
    ./manifest.json
    ./static/css/main.[chunkhash:8].css
    ./static/js/main.[chunkhash:8].js

  dynamic always => cache:false, strategy:network-only
    ./sw-install.js
    ./sw.js

  dynamic versioned => cache:true, strategy:stale-while-revalidate
    ./
    ./asset-manifest.json
    ./data/data-[slice-size].json
    ./data/data.json
    ./data/meta.json
*/

const getVersion = () => '__VERSION__';

const getAppCacheName = () => `DOOEX-app-${getVersion()}`;
const getDataCacheName = () => `DOOEX-data-${getVersion()}`;
const getSavedCacheName = () => 'DOOEX-saved';

function pureFetch(req) {
  const headers = new Headers();
  headers.append('cache-control', 'no-store');
  headers.append('pragma', 'no-cache');

  if (req.constructor === Request) {
    Array.from(req.headers.entries()).forEach(([key, val]) => headers.append(key, val));

    let reqClone;
    if (req.mode === 'navigate') {
      reqClone = new Request(req.url, { headers });
    } else {
      reqClone = new Request(req, { headers });
    }

    return fetch(reqClone);
  }

  return fetch(req, { headers });
}

async function saveNetworkResponseToCache(req, cache) {
  const networkResponse = await pureFetch(req);
  if (networkResponse.ok) {
    cache.put(req, networkResponse.clone());
  }

  return networkResponse;
}

async function cacheFirst(req) {
  const cacheResponse = await caches.match(req);
  if (cacheResponse === undefined) {
    return fetch(req);
  }

  return cacheResponse;
}

function networkOnly(req) {
  return pureFetch(req);
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cacheResponse = await cache.match(req);

  const fetchPromise = saveNetworkResponseToCache(req, cache);

  if (cacheResponse === undefined) {
    return fetchPromise;
  }

  return cacheResponse;
}

async function deleteOldCaches() {
  const cacheNames = await caches.keys();

  const whitelistCacheNames = [
    getAppCacheName(),
    getDataCacheName(),
  ];

  return Promise.all(
    cacheNames
      .filter(cacheName => cacheName.startsWith('DOOEX'))
      .filter(cacheName => !(whitelistCacheNames.includes(cacheName)))
      .map(cacheName => caches.delete(cacheName))
  );
}

async function fetchAppUrls() {
  const resp = await pureFetch('__PUBLIC_PATH__/asset-manifest.json');
  const assetManifest = await resp.json();

  const dynamicAppUrls = Object.keys(assetManifest)
    .filter(k => !(k.endsWith('.map')))
    .map(k => assetManifest[k]);

  const staticAppUrls = [
    '__PUBLIC_PATH__/',

    '__PUBLIC_PATH__/favicon.ico',
    '__PUBLIC_PATH__/manifest.json',

    '__PUBLIC_PATH__/static/css/bootstrap.min.css',
    '__PUBLIC_PATH__/static/fonts/glyphicons-halflings-regular.woff',
  ];

  return staticAppUrls.concat(dynamicAppUrls);
}

async function cacheAppUrls() {
  const appUrls = await fetchAppUrls();

  const cacheName = getAppCacheName();

  const cacheExists = await caches.has(cacheName);
  if (cacheExists) {
    return;
  }

  const cache = await caches.open(cacheName);

  const cacheResponses = await Promise.all(
    appUrls.map(url => caches.match(url))
  );

  return Promise.all(
    appUrls.map((url, i) => {
      if (cacheResponses[i] === undefined) {
        return saveNetworkResponseToCache(url, cache);
      }

      return cache.put(url, cacheResponses[i].clone());
    })
  );
}

async function cacheDataUrls() {
  const dataUrls = [
    '__PUBLIC_PATH__/data/data.json',
    '__PUBLIC_PATH__/data/meta.json',
  ];

  const cache = await caches.open(getDataCacheName());
  return Promise.all(
    dataUrls.map(url => saveNetworkResponseToCache(url, cache))
  );
}

self.addEventListener('install', (e) => {
  cacheDataUrls();

  e.waitUntil(cacheAppUrls());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (e) => {
  const requestUrl = new URL(e.request.url);

  if (requestUrl.origin === self.location.origin) {
    switch (requestUrl.pathname) {
      case '__PUBLIC_PATH__/favicon.ico':
      case '__PUBLIC_PATH__/manifest.json':
        return e.respondWith(cacheFirst(e.request));

      case '__PUBLIC_PATH__/':
      case '__PUBLIC_PATH__/asset-manifest.json':
        return e.respondWith(staleWhileRevalidate(e.request, getAppCacheName()));

      case '__PUBLIC_PATH__/sw-install.js':
      case '__PUBLIC_PATH__/sw.js':
        return e.respondWith(networkOnly(e.request));

      default:
    }

    if (requestUrl.pathname.includes('/static/')) {
      return e.respondWith(cacheFirst(e.request));
    }

    if (requestUrl.pathname.includes('/data/')) {
      return e.respondWith(staleWhileRevalidate(e.request, getDataCacheName()));
    }

    /*
      TODO: cannot cache iframe resources - find another way out
    */
    if (requestUrl.pathname.includes('/saved/')) {
      const resourceUrl = requestUrl.search.replace('?url=', '');
      const resourceRequest = new Request(resourceUrl, e.request);

      return e.respondWith(cacheFirst(resourceRequest));
    }
  }

  /*
    return cached assets, if any
    return [new] network data
  */
  // e.respondWith(fetch(e.request));
});

self.addEventListener('message', (e) => {
  switch (e.data.action) {
    case 'control':
      if (self.clients && self.clients.clients) {
        self.clients.claim();
      }
      break;

    case 'skipWaiting':
      if (self.skipWaiting) {
        self.skipWaiting();
      }
      break;

    default:
  }
});
