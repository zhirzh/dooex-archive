import { deflate, init, readyPromise } from '@/modules/data';

let allDoodles;
let metaData;

readyPromise.then((data) => {
  allDoodles = data.allDoodles;
  metaData = data.metaData;
});

/**
 * Respond with metaData.
 * @param {Request} req
 * @param {Response} resp
 */
async function meta(req, resp) {
  await readyPromise;

  resp.send(metaData);
}

/**
 * Respond with all doodles.
 * @param {Request} req
 * @param {Response} resp
 */
async function show(req, resp) {
  await readyPromise;

  const { doodleId } = req.params;

  resp.json(deflate(allDoodles.find(doodle => doodle.id === doodleId)));
}

/**
 * Respond with all doodles.
 * @param {Request} req
 * @param {Response} resp
 */
async function showAll(req, resp) {
  await readyPromise;

  resp.json(allDoodles.map(deflate));
}

/**
 * Respond with data slice.
 * @param {Request} req
 * @param {Response} resp
 */
async function slice(req, resp) {
  await readyPromise;

  const offset = parseInt(req.params.offset, 10);
  const sliceSize = parseInt(req.params.sliceSize, 10);

  const doodleSlice = allDoodles.slice(offset, offset + sliceSize);

  resp.json(doodleSlice.map(deflate));
}

/**
 * Stream all doodles.
 * @param {WebSocket} socket
 */
async function stream(socket) {
  await readyPromise;

  allDoodles.forEach((doodle) => {
    socket.send(JSON.stringify(deflate(doodle)));
  });

  socket.close();
}

export { meta, show, showAll, slice, stream };
