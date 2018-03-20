// @flow
'use strict';

const chalk = require('chalk');
const path = require('path');
const address = require('address');
const joinUrlParts = require('./join-url-parts');

// Log some things when BrowserSync starts.
// Using this to replace BrowserSync's regular logging to ensure the
// siteBasePath is included and users know where to go.g
function serverInitMessage(
  batfishConfig: BatfishConfiguration,
  actualPort: number
): string {
  const localUrl = joinUrlParts(
    `http://localhost:${actualPort}`,
    batfishConfig.siteBasePath,
    ''
  );
  const chevron = chalk.green.bold('>');
  let result = `Development server ready.`;
  result += `\n  ${chevron} Access your site at ${chalk.bold.magenta.underline(
    localUrl
  )}`;

  const ip = address.ip();
  if (ip) {
    const externalUrl = joinUrlParts(
      `http://${ip}:${actualPort}`,
      batfishConfig.siteBasePath,
      ''
    );
    result += `\n  ${chevron} Available externally at ${chalk.magenta(
      externalUrl
    )}`;
  }

  result += `\n  ${chevron} Compiled files are in ${chalk.cyan(
    path.relative(process.cwd(), batfishConfig.outputDirectory)
  )}`;
  return result;
}

module.exports = serverInitMessage;
