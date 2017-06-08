'use strict';

const path = require('path');

module.exports = {
  entry: path.join(__dirname, './src/index.js'),
  sourceDirectory: path.join(__dirname, 'src'),
  outputDirectory: path.join(__dirname, 'site'),
  wrapperPath: path.join(__dirname, './src/components/wrapper.js')
  // production
  // verbose
  // port
  // vendor
};
