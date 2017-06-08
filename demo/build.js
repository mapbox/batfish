'use strict';

const path = require('path');
const batfish = require('..');

const entry = path.join(__dirname, './src/index.js');

batfish.build({
  entry,
  sourceDirectory: path.join(__dirname, 'src'),
  outputDirectory: path.join(__dirname, 'site')
});
