/* eslint-disable node/no-unpublished-require */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV || 'production' == 'production';

const config = {
  entry: {
    addPixel: './lib/api/add-pixel/index.js',
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  resolve: {
    fallback: {
      util: false
    }
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
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
