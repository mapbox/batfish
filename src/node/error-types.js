// @flow
'use strict';

const fasterror = require('fasterror');

const errorTypes = Object.freeze({
  ConfigFatalError: (fasterror('ConfigFatalError'): Class<WrappedError>),
  ConfigValidationError: (fasterror(
    'ConfigValidationErrors'
  ): Class<ConfigValidationError>),
  WebpackFatalError: (fasterror('WebpackFatalError'): Class<WrappedError>),
  WebpackCompilationError: (fasterror(
    'WebpackCompilationError'
  ): Class<WebpackCompilationError>),
  WebpackNodeParseError: (fasterror(
    'WebpackNodeParseError'
  ): Class<WrappedError>),
  WebpackNodeExecutionError: (fasterror(
    'WebpackNodeExecutionError'
  ): Class<WrappedError>),
  CssCompilationError: (fasterror('CssCompilationError'): Class<WrappedError>),
  FrontMatterError: (fasterror('FrontMatterError'): Class<WrappedError>)
});

module.exports = errorTypes;
