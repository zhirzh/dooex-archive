const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const request = require('request');

const tunnelPublicPath = path.resolve(__dirname, '..', 'public', 'tunnel');
function tunnel(req, resp) {
  const url = new URL(req.url.slice(1));
  const noOriginUrl = url.href.replace(url.origin, '');

  const remoteReq = request(url.href);

  // fetch remote asset
  remoteReq.pipe(resp);

  // save local copy for later visits
  if (!fs.existsSync(tunnelPublicPath)) {
    fs.mkdirSync(tunnelPublicPath);
  }

  path
    .dirname(noOriginUrl)
    .split(path.sep)
    .filter(Boolean)
    .reduce((parentDirpath, dirname) => {
      const dirpath = path.resolve(parentDirpath, dirname);
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }

      return dirpath;
    }, tunnelPublicPath);

  remoteReq.pipe(
    fs.createWriteStream(path.resolve(tunnelPublicPath, noOriginUrl.slice(1))),
  );
}

module.exports = {
  tunnel,
};
