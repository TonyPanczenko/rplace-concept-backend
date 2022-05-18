/* eslint-disable node/no-unpublished-require */
const path = require('path');

const isProduction = process.env.NODE_ENV || 'production' == 'production';

const config = {
  entry: {
    addPixel: './lib/api/add-pixel/index.js',
    getImage: './lib/api/get-image/index.js'
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    chunkFormat: 'commonjs'
  },
  target: 'node',
  resolve: {
    fallback: {
      util: false
    }
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
