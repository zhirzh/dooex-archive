const fs = require('fs');
const path = require('path');

const paths = require('./paths');

/**
 * Update `VERSION` veriable in service-worker script.
 * This allows loading fresh worker in browser.
 */
const serviceWorkerVersionWriter = {
  apply(compiler) {
    compiler.plugin('done', (_) => {
      const timestamp = new Date().getTime();

      const swFilePath = path.join(paths.appPublic, 'sw.js');
      const swContent = fs.readFileSync(swFilePath, 'utf8');

      fs.writeFileSync(swFilePath, swContent.replace('{{VERSION}}', timestamp));
    });
  },
};

module.exports = {
  entry: {
    sw: path.join(paths.appSrc, 'sw'),
  },

  output: {
    filename: '[name].js',
    path: paths.appPublic,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['env'],
        },
      },
    ],
  },

  plugins: [serviceWorkerVersionWriter],

  target: 'web',
};
