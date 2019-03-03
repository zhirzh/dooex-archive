const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

const commonConfig = {
  output: {
    path: DIST_DIR,
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: SRC_DIR,
        loader: 'babel',
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', ['css?modules=true', 'sass']),
      },
    ],
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: [
      'node_modules',
      path.resolve(SRC_DIR),
    ],
  },

  plugins: [
    new ExtractTextPlugin('css/index.css'),
  ],
};

if (process.argv.includes('-p')) {
  commonConfig.plugins = commonConfig.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
    }),

    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
  ]);
}

const appConfig = merge(commonConfig, {
  entry: {
    index: path.resolve(SRC_DIR, 'index.js'),
    'sw-install': path.resolve(SRC_DIR, 'sw-install.js'),
  },

  output: {
    filename: 'js/[name].js',
  },
});

const ServiceWorkerConfig = merge(commonConfig, {
  entry: path.resolve(SRC_DIR, 'sw.js'),

  output: {
    filename: 'sw.js',
  },
});

const appShellConfig = merge(commonConfig, {
  target: 'node',

  entry: path.resolve(SRC_DIR, 'appshell.js'),

  output: {
    filename: 'appshell.js',
  },
});

module.exports = [appConfig, ServiceWorkerConfig, appShellConfig];
