'use strict';

const fasterror = require('fasterror');

module.exports = {
  ConfigFatalError: fasterror('ConfigFatalError'),
  ConfigValidationError: fasterror('ConfigValidationError'),
  WebpackFatalError: fasterror('WebpackFatalError'),
  WebpackCompilationError: fasterror('WebpackCompilationError'),
  CssCompilationError: fasterror('CssCompilationError')
};
