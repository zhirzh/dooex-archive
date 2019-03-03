importScripts('workbox-sw.prod.v1.0.1.js');

const workboxSW = new self.WorkboxSW({
  skipWaiting: true,
  clientsClaim: true,
});

// workboxSW.router.registerRoute(/static/, workboxSW.strategies.cacheFirst());

// [
//   '/favicon.ico',
//   '/index.html',
//   '/manifest.json',
// ].forEach((url) => {
//   workboxSW.router.registerRoute(url, workboxSW.strategies.cacheFirst());
// });

workboxSW.router.registerRoute(
  /data/,
  workboxSW.strategies.staleWhileRevalidate({
    // cacheName: 'data',
    cacheExpiration: {
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
  }),
);

function savedHandler() {
  const cacheFirst = workboxSW.strategies.cacheFirst({
    cacheName: 'DOOEX-saved',
  });

  return (props) => {
    const url = new URL(props.url.search.replace('?', ''));
    const request = new Request(url, props.event.request);

    props.url = url;
    props.event = new FetchEvent('fetch', { request });

    return cacheFirst.handle(props);
  };
}

function tunnelHandler() {
  const cacheFirst = workboxSW.strategies.cacheFirst({
    cacheName: 'DOOEX-saved',
  });

  return (props) => {
    const url = props.url;
    url.pathname = `/tunnel/https://www.google.com${url.pathname}`;

    const request = new Request(url);

    props.url = url;
    props.event = new FetchEvent('fetch', { request });
    return cacheFirst.handle(props);
  };
}

// MUST come before /saved
workboxSW.router.registerRoute(/logos/, tunnelHandler());
workboxSW.router.registerRoute(/doodles\/api/, tunnelHandler());

// MUST come after /logos and /doodles/api
workboxSW.router.registerRoute(/saved/, savedHandler());

workboxSW.precache([]);
