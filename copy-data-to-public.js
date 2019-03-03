const path = require('path');

const fs = require('fs-extra');
// const zlib = require('zlib');

const paths = require('./config/paths');

function copy() {
  fs.copySync(paths.appData, path.resolve(paths.appPublic, 'data'), {
    dereference: true,
    filter: filename => !filename.includes('raw'),
  });
}

module.exports = copy;

if (module.parent === null) {
  copy();
}
