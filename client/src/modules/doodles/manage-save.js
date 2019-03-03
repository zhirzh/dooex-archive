async function saveDoodle(doodle) {
  const resp = await fetch(doodle.url, { mode: 'no-cors' });
  const cache = await caches.open('DOOEX-saved');

  return cache.put(doodle.url, resp);
}

async function unsaveDoodle(doodle) {
  const cache = await caches.open('DOOEX-saved');

  return cache.delete(doodle.url);
}

export { saveDoodle, unsaveDoodle };
