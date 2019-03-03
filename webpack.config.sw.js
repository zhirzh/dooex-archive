const fs = require('fs');
const path = require('path');
const url = require('url');

const paths = require('./config/paths');

const isProduction = process.env.NODE_ENV === 'production';

const dest = isProduction ? paths.appBuild : paths.appPublic;

const serviceWorkerVersionWriter = {
  apply(compiler) {
    compiler.plugin('done', (stats) => {
      const swFilePath = path.resolve(dest, 'sw.js');

      fs.writeFileSync(
        swFilePath,
        fs.readFileSync(swFilePath, 'utf8').replace(/__VERSION__/g, (new Date()).getTime())
      );
    });
  }
};

const publicPathWriter = {
  apply(compiler) {
    const packageJson = require(path.resolve(__dirname, 'package.json'))
    if (packageJson.homepage === undefined) {
      return;
    }

    const publicPath = isProduction ? new url.URL(packageJson.homepage).pathname : '';

    compiler.plugin('done', () => {
      const swFilePath = path.resolve(dest, 'sw.js');

      fs.writeFileSync(
        swFilePath,
        fs.readFileSync(swFilePath, 'utf8').replace(/__PUBLIC_PATH__/g, publicPath)
      );
    });
  }
};

module.exports = {
  entry: {
    sw: './src/sw',
    'sw-install': './src/sw-install',
  },

  devtool: 'source-map',

  output: {
    filename: '[name].js',
    path: dest,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    serviceWorkerVersionWriter,
    publicPathWriter,
  ],
};
