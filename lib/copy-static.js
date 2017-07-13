'use strict';

const path = require('path');
const cpy = require('cpy');

function copyStatic(batfishConfig) {
  return cpy('**/*', path.join(batfishConfig.outputDirectory, 'static'), {
    cwd: batfishConfig.staticDirectory,
    parents: true
  });
}

module.exports = copyStatic;
