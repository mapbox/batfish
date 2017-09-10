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
  const relativeOutputDirectory =
    path.relative(
      process.cwd(),
      serverInstance.instance.options.get('server').get('baseDir')
    ) + '/';
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
  result += `\n  ${chevron} Compiled files are in ${chalk.cyan(
    relativeOutputDirectory
  )}`;
  return result;
}

module.exports = serverInitMessage;
