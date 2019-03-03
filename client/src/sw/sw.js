/* global WorkboxSW */

import SavedHandler from './saved-handler';
import TunnelHandler from './tunnel-handler';

importScripts('/workbox-sw.prod.v2.1.0.js');

console.log('{{VERSION}}');

const sw = new WorkboxSW({
  cacheId: 'dooex',
  clientsClaim: true,
  skipWaiting: true,
});

['/', '/doodles/all', '/doodles/meta'].forEach((url) => {
  sw.router.registerRoute(url, sw.strategies.staleWhileRevalidate());
});

sw.router.registerRoute(/bundle\.js/, sw.strategies.networkOnly()); // bypass for dev

sw.router.registerRoute(/logos/, new TunnelHandler(sw));
sw.router.registerRoute(/doodles\/api/, new TunnelHandler(sw));

sw.router.registerRoute(/saved/, new SavedHandler(sw)); // after TunnelHandler

sw.precache([]);
