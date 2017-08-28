// @flow
'use strict';

const chalk = require('chalk');
const webpackFormatMessages = require('webpack-format-messages');
const errorTypes = require('./error-types');
const renderPrettyErrorStack = require('./render-pretty-error-stack');

// If the Error is of a known type, convert it to a nice legible string.
// Otherwise return undefined and expect the consumer to deal with the Error's
// message.
function getLoggableErrorMessage(error: Error): string | void {
  let message = chalk.red.bold('Error: ');

  if (error instanceof errorTypes.ConfigFatalError) {
    message += 'Fatal configuration error.\n\n';
    message += `${error.message}\n`;
    return message;
  }

  if (error instanceof errorTypes.ConfigValidationError) {
    message += 'Invalid configuration.\n\n';
    message += `${error.message}\n`;
    return message;
  }

  if (error instanceof errorTypes.ConfigValidationErrors) {
    message += 'Invalid configuration.\n\n';
    error.validationErrors.forEach(validationError => {
      message += `- ${validationError}\n`;
    });
    return message;
  }

  if (error instanceof errorTypes.WebpackFatalError) {
    const webpackOptions = [
      'webpackLoaders',
      'webpackPlugins',
      'webpackStaticIgnore'
    ]
      .map(x => chalk.yellow(x))
      .join(', ');
    message += `Webpack fatal error. Please check any Batfish configuration options that pass directly into Webpack configuration (${webpackOptions}).\n\n`;
    message += `Error message: ${error.originalError.message}\n`;
    return message;
  }

  if (error instanceof errorTypes.WebpackCompilationError) {
    message += `Webpack compilation error.\n\n`;
    const formattedMessages = webpackFormatMessages(error.stats);
    formattedMessages.errors.forEach(errorMessage => {
      message += `${errorMessage}\n`;
    });
    return message;
  }

  if (error instanceof errorTypes.CssCompilationError) {
    message += `CSS compilation error. This may mean you have non-standard syntax that you forgot to compile with PostCSS.\n\n`;
    message += `${error.message}\n`;
    return message;
  }

  if (error instanceof errorTypes.WebpackNodeParseError) {
    message += `Failed to parse Webpack-compiled version of static-render-pages.js\n\n`;
    message += `Error message: ${error.originalError.message}\n`;
    return message;
  }

  if (error instanceof errorTypes.WebpackNodeExecutionError) {
    message += `Failed to execute Webpack-compiled version of static-render-pages.js.\n${chalk.bold(
      'You may be importing a JS file that cannot run in Node.'
    )}\n\n`;
    message += renderPrettyErrorStack(error.originalError);
    return message;
  }

  return;
}

module.exports = getLoggableErrorMessage;
