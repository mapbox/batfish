'use strict';

const fasterror = require('fasterror');

module.exports = {
  ConfigFatalError: fasterror('ConfigFatalError'),
  ConfigValidationError: fasterror('ConfigValidationError'),
  WebpackFatalError: fasterror('WebpackFatalError'),
  WebpackCompilationError: fasterror('WebpackCompilationError'),
  WebpackNodeParseError: fasterror('WebpackNodeParseError'),
  WebpackNodeExecutionError: fasterror('WebpackNodeExecutionError'),
  CssCompilationError: fasterror('CssCompilationError')
};
