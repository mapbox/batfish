// @flow
'use strict';

const chalk = require('chalk');
const wrapError = require('./wrap-error');
const errorTypes = require('./error-types');

// Special logging for PostCSS errors. Makes them very easy to understand.
function rethrowPostcssError(error: Object): WrappedError {
  error.message = `${chalk.yellow('PostCSS error:')} ${error.message}`;
  if (error.name === 'CssSyntaxError') {
    error.message = error.message + '\n' + error.showSourceCode();
  }
  const typedError = wrapError(error, errorTypes.CssCompilationError);
  throw typedError;
}

module.exports = rethrowPostcssError;
