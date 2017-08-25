'use strict';

const fasterror = require('fasterror');

module.exports = {
  ConfigFatalError: fasterror('ConfigFatalError'),
  // Singular ConfigValidationError is just one. Plural is an array, with a
  // validationErrors property.
  ConfigValidationError: fasterror('ConfigValidationError'),
  ConfigValidationErrors: fasterror('ConfigValidationErrors'),
  WebpackFatalError: fasterror('WebpackFatalError'),
  WebpackCompilationError: fasterror('WebpackCompilationError'),
  WebpackNodeParseError: fasterror('WebpackNodeParseError'),
  WebpackNodeExecutionError: fasterror('WebpackNodeExecutionError'),
  CssCompilationError: fasterror('CssCompilationError')
};
