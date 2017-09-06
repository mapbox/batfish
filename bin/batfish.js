#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const batfishLog = require('../dist/node/batfish-log');
const start = require('../dist/node/start');
const build = require('../dist/node/build');
const serveStatic = require('../dist/node/serve-static');
const getLoggableErrorMessage = require('../dist/node/get-loggable-error-message');
const renderPrettyErrorStack = require('../dist/node/render-pretty-error-stack');
const constants = require('../dist/node/constants');

const commands = {
  start,
  build,
  'serve-static': serveStatic
};

const description = `Build websites with batfish.`;
const help = `
${chalk.bold('Usage')}
  batfish <command> [options]

  You must provide a batfish configuration module, either with
  batish.config.js in process.cwd() or with the --config option.

${chalk.bold('Commands')}
  start            Start a development server.
  build            Build the static site.
  serve-static     Serve the static site.

${chalk.bold('Shared options')}
  -c, --config     Path to your configuration module.
                   Default: batfish.config.js
  -V, --verbose    Log extra stats.

${chalk.bold(`${chalk.magenta('start')} options`)}
  -p, --port       Server port. Default: 8080.
  --production     Build as though for production.
  --no-clear       Do not clear the destination directory.

${chalk.bold(`${chalk.magenta('build')} options`)}
  -d, --debug      Build for debugging, not for production.
  --no-clear       Do not clear the destination directory.

${chalk.bold(`${chalk.magenta('serve-static')} options`)}
  -p, --port       Server port. Default: 8080.

${chalk.bold('Examples')}
  batfish start
  batfish build --production
  batfish serve-static -p 9966 -c conf/bf.js
`;

const cli = meow(
  {
    description,
    help
  },
  {
    alias: {
      c: 'config',
      V: 'verbose',
      p: 'port',
      d: 'debug'
    }
  }
);

const logCliError = message => {
  batfishLog.error(`${chalk.red.bold('CLI error:')} ${message}`);
};

const command = cli.input[0];
if (command === undefined || commands[command] === undefined) {
  logCliError('You must specify a valid command.');
  cli.showHelp();
}

const isDefaultConfigPath = cli.flags.config === undefined;
let configPath;
if (cli.flags.config) {
  configPath = path.isAbsolute(cli.flags.config)
    ? cli.flags.config
    : path.join(process.cwd(), cli.flags.config);
} else {
  configPath = path.join(process.cwd(), 'batfish.config.js');
}

let config = {};
if (configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const configModule = require(configPath);
      if (typeof configModule !== 'function') {
        logCliError(
          'Your configuration module must export a function that returns an object.'
        );
        process.exit(2);
      }
      config = configModule();
    }
  } catch (error) {
    if (!isDefaultConfigPath) {
      logCliError(
        `Failed to load configuration module from ${chalk.underline(
          configPath
        )}`
      );
    }
    throw error;
  }
}

if (cli.flags.production) {
  config.production = cli.flags.production;
}
if (cli.flags.debug) {
  config.production = !cli.flags.debug;
}
if (cli.flags.port) {
  config.port = cli.flags.port;
}
if (cli.flags.verbose) {
  config.verbose = cli.flags.verbose;
}
if (cli.flags.clear === false) {
  config.clearOutputDirectory = false;
}

const executeCommand = commands[command];
const emitter = executeCommand(config, path.dirname(configPath));
emitter.on(constants.EVENT_NOTIFICATION, batfishLog.log);
emitter.on(constants.EVENT_ERROR, error => {
  const niceMessage = getLoggableErrorMessage(error);
  if (niceMessage) {
    batfishLog.error(niceMessage);
  } else {
    batfishLog.error(renderPrettyErrorStack(error));
  }
  process.exit(1);
});
