import fs from 'fs';
import path from 'path';
import URL from 'url';

import request from 'request';

import { PUBLIC_DIR } from '@/paths';

const tunnelPublicPath = path.resolve(PUBLIC_DIR, 'tunnel');

if (!fs.existsSync(tunnelPublicPath)) {
  fs.mkdirSync(tunnelPublicPath);
}

function persist(remoteReq, pathname) {
  path
    .dirname(pathname)
    .split('/')
    .filter(Boolean)
    .reduce((parentDirpath, dirname) => {
      const dirpath = path.resolve(parentDirpath, dirname);

      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }

      return dirpath;
    }, tunnelPublicPath);

  const resourcePath = URL.parse(pathname).pathname.slice(1);
  const outputStream = fs.createWriteStream(path.resolve(tunnelPublicPath, resourcePath));

  remoteReq.pipe(outputStream);
}

function tunnel(req, resp) {
  const pathname = req.url;
  const url = `https://www.google.com${pathname}`;

  const remoteReq = request(url);

  remoteReq.pipe(resp);

  persist(remoteReq, pathname);
}

export { tunnel };
