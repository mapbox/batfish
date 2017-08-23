'use strict';

const chalk = require('chalk');
const path = require('path');

/**
 * Log some things when a BrowserSync starts.
 * Using this to replace BrowserSync's regular logging to ensure the
 * siteBasePath is included and users know where to go.
 *
 * @param {BrowserSync} serverInstance
 * @param {BatfishConfig} batfishConfig
 */
function serverInitMessage(serverInstance, batfishConfig) {
  const relativeOutputDirectory =
    path.relative(
      process.cwd(),
      serverInstance.options.get('server').get('baseDir')
    ) + '/';
  const urls = serverInstance.options.get('urls');
  const localUrl = urls.get('local') + batfishConfig.siteBasePath + '/';
  const externalUrl = urls.get('external') + batfishConfig.siteBasePath + '/';
  let result = `Development server ready.`;
  result += `\n  ${chalk.green.bold(
    '>'
  )} Access your site at ${chalk.bold.magenta.underline(localUrl)}`;
  result += `\n  ${chalk.green.bold(
    '>'
  )} Available externally at ${chalk.magenta(externalUrl)}`;
  result += `\n  ${chalk.green.bold('>')} Compiled files are in ${chalk.cyan(
    relativeOutputDirectory
  )}`;
  return result;
}

module.exports = serverInitMessage;
