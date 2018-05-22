// @flow
'use strict';

const webpack = require('webpack');

// This file will be copied into dist/, so these types will serve as the type
// definition of the public API for Flow-using users.
type BatfishStart = (
  rawConfig?: Object,
  projectDirectory?: string
) => events$EventEmitter;
type BatfishBuild = (
  rawConfig?: Object,
  projectDirectory?: string
) => events$EventEmitter;
type BatfishServeStatic = (
  rawConfig?: Object,
  projectDirectory?: string
) => events$EventEmitter;
type BatfishWriteBabelrc = (
  rawConfig?: Object,
  options?: {
    projectDirectory?: string,
    outputDirectory?: string,
    target?: 'browser' | 'node'
  }
) => string;

module.exports = {
  start: (require('./start'): BatfishStart),
  build: (require('./build'): BatfishBuild),
  serveStatic: (require('./serve-static'): BatfishServeStatic),
  writeBabelrc: (require('./write-babelrc'): BatfishWriteBabelrc),
  webpack
};
