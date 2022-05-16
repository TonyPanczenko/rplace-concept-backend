/* eslint-disable node/no-unpublished-require */
const path = require('path');
// const { IgnorePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV || 'production' == 'production';

const config = {
  entry: {
    addPixel: './lib/api/add-pixel/index.js',
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    chunkFormat: 'commonjs'
  },
  target: 'node',
  resolve: {
    fallback: {
      util: false
    }
  },
  // plugins: [
  //   new IgnorePlugin({
  //     resourceRegExp: /aws-sdk/,
  //   })
  // ],
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
      terserOptions: {
        mangle: false
      }
    })],
  },
  externals: {
    'aws-sdk': 'commonjs aws-sdk',
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';       
  } else {
    config.mode = 'development';
  }
  return config;
};
