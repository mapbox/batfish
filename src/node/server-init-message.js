// @flow
'use strict';

const chalk = require('chalk');
const path = require('path');

// Log some things when BrowserSync starts.
// Using this to replace BrowserSync's regular logging to ensure the
// siteBasePath is included and users know where to go.g
function serverInitMessage(
  serverInstance: Object,
  batfishConfig: BatfishConfiguration
): string {
  const urls = serverInstance.instance.options.get('urls');
  const localUrl =
    urls.get('local') + batfishConfig.siteBasePath.replace(/([^/])$/, '$1/');
  const externalUrl =
    urls.get('external') + batfishConfig.siteBasePath.replace(/([^/])$/, '$1/');
  const chevron = chalk.green.bold('>');
  let result = `Development server ready.`;
  result += `\n  ${chevron} Access your site at ${chalk.bold.magenta.underline(
    localUrl
  )}`;
  result += `\n  ${chevron} Available externally at ${chalk.magenta(
    externalUrl
  )}`;

  // Since this code relies heavily on the internal details of the BrowserSync
  // instance -- which seem to be only *partly* public (?), so subject to
  // breaking changes -- we need to have a safe exit if it doesn't work.
  try {
    const relativeOutputDirectory =
      path.relative(
        process.cwd(),
        serverInstance.instance.options
          .get('server')
          .get('baseDir')
          .get(0)
      ) + '/';
    result += `\n  ${chevron} Compiled files are in ${chalk.cyan(
      relativeOutputDirectory
    )}`;
  } catch (e) {
    /**/
  }
  return result;
}

module.exports = serverInitMessage;
