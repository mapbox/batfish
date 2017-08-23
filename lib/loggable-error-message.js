'use strict';

const chalk = require('chalk');
const webpackFormatMessages = require('webpack-format-messages');
const errorTypes = require('./error-types');

function loggableErrorMessage(error) {
  let message = chalk.red.bold('Error: ');

  if (error instanceof errorTypes.ConfigFatalError) {
    message += 'Fatal configuration error.\n';
    message += error.message;
    return message;
  }

  if (error instanceof errorTypes.ConfigValidationError) {
    message += 'Invalid configuration.';
    error.validationErrors.forEach(validationError => {
      message += `\n- ${validationError}`;
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
    message += `CSS compilation error.\n\n`;
    message += `${error.message}\n`;
    return message;
  }

  return;
}

module.exports = loggableErrorMessage;
