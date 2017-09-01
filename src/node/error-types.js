// @flow
'use strict';

const fasterror = require('fasterror');

const errorTypes = Object.freeze({
  ConfigValidationErrors: (fasterror('ConfigValidationErrors'): Class<
    ConfigValidationErrors
  >),
  ConfigFatalError: (fasterror('ConfigFatalError'): Class<WrappedError>),
  // Singular ConfigValidationError is just one. Plural is an array, with a
  // validationErrors property.
  ConfigValidationError: (fasterror('ConfigValidationError'): Class<
    WrappedError
  >),
  WebpackFatalError: (fasterror('WebpackFatalError'): Class<WrappedError>),
  WebpackCompilationError: (fasterror('WebpackCompilationError'): Class<
    WebpackCompilationError
  >),
  WebpackNodeParseError: (fasterror('WebpackNodeParseError'): Class<
    WrappedError
  >),
  WebpackNodeExecutionError: (fasterror('WebpackNodeExecutionError'): Class<
    WrappedError
  >),
  CssCompilationError: (fasterror('CssCompilationError'): Class<WrappedError>)
});

module.exports = errorTypes;
