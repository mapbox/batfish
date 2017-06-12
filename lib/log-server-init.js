'use strict';

const chalk = require('chalk');
const timelog = require('./timelog');

/**
 * Log some things when a BrowserSync starts.
 * Using this to replace the regular logging to ensure the siteBasePath is included.
 *
 * @param {BrowserSync} serverInstance
 * @param {BatfishConfig} batfishConfig
 */
function logServerInit(serverInstance, batfishConfig) {
  const urls = serverInstance.options.get('urls');
  const localUrl = urls.get('local') + batfishConfig.siteBasePath + '/';
  const externalUrl = urls.get('external') + batfishConfig.siteBasePath + '/';
  timelog(`Access your site at ${chalk.bold.magenta.underline(localUrl)}`);
  timelog(`Available externally at at ${chalk.magenta(externalUrl)}`);
  timelog(
    `Compiled files are in ${chalk.cyan(
      serverInstance.options.get('server').get('baseDir')
    )}`
  );
}

module.exports = logServerInit;
