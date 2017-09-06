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
  let result = chalk.red.bold('Error: ');

  if (error instanceof errorTypes.ConfigFatalError) {
    result += 'Fatal configuration error.\n\n';
    result += `${error.message}\n`;
    return result;
  }

  if (error instanceof errorTypes.ConfigValidationError) {
    result += 'Invalid configuration.\n\n';
    if (error.messages) {
      error.messages.forEach(m => {
        result += `- ${m}\n`;
      });
    } else {
      result += `${error.message}\n`;
    }
    return result;
  }

  if (error instanceof errorTypes.WebpackFatalError) {
    const webpackOptions = [
      'webpackLoaders',
      'webpackPlugins',
      'webpackStaticIgnore'
    ]
      .map(x => chalk.yellow(x))
      .join(', ');
    result += `Webpack fatal error. Please check any Batfish configuration options that pass directly into Webpack configuration (${webpackOptions}).\n\n`;
    result += `Error message: ${error.originalError.message}\n`;
    return result;
  }

  if (error instanceof errorTypes.WebpackCompilationError) {
    result += `Webpack compilation error.\n\n`;
    const formattedMessages = webpackFormatMessages(error.stats);
    formattedMessages.errors.forEach(errorMessage => {
      result += `${errorMessage}\n`;
    });
    return result;
  }

  if (error instanceof errorTypes.CssCompilationError) {
    result += `CSS compilation error. This may mean you have non-standard syntax that you forgot to compile with PostCSS.\n\n`;
    result += `${error.message}\n`;
    return result;
  }

  if (error instanceof errorTypes.WebpackNodeParseError) {
    result += `Failed to parse Webpack-compiled version of static-render-pages.js\n\n`;
    result += `Error message: ${error.originalError.message}\n`;
    return result;
  }

  if (error instanceof errorTypes.WebpackNodeExecutionError) {
    result += `Failed to execute Webpack-compiled version of static-render-pages.js.\n${chalk.bold(
      'You may be importing a JS file that cannot run in Node.'
    )}\n\n`;
    result += renderPrettyErrorStack(error.originalError);
    return result;
  }

  return;
}

module.exports = getLoggableErrorMessage;
