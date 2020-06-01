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
const writeBabelrc = require('../dist/node/write-babelrc');
const getLoggableErrorMessage = require('../dist/node/get-loggable-error-message');
const renderPrettyErrorStack = require('../dist/node/render-pretty-error-stack');
const constants = require('../dist/node/constants');

const commands = {
  start,
  build,
  'serve-static': serveStatic,
  'write-babelrc': writeBabelrc
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
  write-babelrc    Write a .babelrc file that other processes,
                   like your test runner, can use.

${chalk.bold('Shared options')}
  -c, --config     Path to your configuration module.
                   Default: batfish.config.js
  -V, --verbose    Log extra stats.

${chalk.bold(`${chalk.magenta('start')} options`)}
  -p, --port       Server port. Default: 8080.
  -i, --include    Build only the specified page(s). Value
                   is a glob relative to the root of your site.
  --production     Build as though for production.
  --no-clear       Do not clear the destination directory.
  -b, --browsers   A comma-separated browserslist string
                   specifying the browsers you want to support
                   during this dev build. Or "false" if you
                   want to support all your production browsers.

${chalk.bold(`${chalk.magenta('build')} options`)}
  -d, --debug      Build for debugging, not for production.
  --no-clear       Do not clear the destination directory.
  -s, --stats      Generate Webpack statistics.

${chalk.bold(`${chalk.magenta('serve-static')} options`)}
  -p, --port       Server port. Default: 8080.

${chalk.bold(`${chalk.magenta('write-babelrc')} options`)}
  --target         "node" or "browser". Default: "node".
  --dir            Directory where .babelrc should be written.
                   Default: same directory as Batfish config.

${chalk.bold('Examples')}
  No options are required for any command.
    ${chalk.cyan('batfish start')}
    ${chalk.cyan('batfish build')}
    ${chalk.cyan('batfish serve-static')}
    ${chalk.cyan('batfish write-babelrc')}
  Build with your Batfish config in a special place.
    ${chalk.cyan('batfish build -c conf/bf.js')}
  Start with an alternate port.
    ${chalk.cyan('batfish start -p 9966')}
  Start but only build the /about pages.
    ${chalk.cyan('batfish start -i about/**')}
  Start but only build the /about/history page.
    ${chalk.cyan('batfish start --include about/history')}
  Start and build only for Chrome 60+.
    ${chalk.cyan('batfish start --browsers "Chrome >= 60"')}
`;

const cli = meow({
  description,
  help,
  flags: {
    config: {
      type: 'string',
      alias: 'c'
    },
    verbose: {
      type: 'boolean',
      alias: 'V'
    },
    stats: {
      type: 'boolean',
      alias: 's'
    },
    port: {
      type: 'number',
      alias: 'p'
    },
    debug: {
      type: 'boolean',
      alias: 'd'
    },
    target: {
      type: 'string'
    },
    dir: {
      type: 'string'
    },
    include: {
      type: 'string',
      alias: 'i'
    },
    browsers: {
      type: 'string',
      alias: 'b'
    }
  }
});

const logCliError = (message) => {
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
} else if (command === 'build') {
  config.production = true;
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
if (cli.flags.stats) {
  config.webpackStats = true;
}
if (command === 'start' && cli.flags.include) {
  config.includePages = [].concat(cli.flags.include);
}
if (cli.flags.clear === false) {
  config.clearOutputDirectory = false;
}
if (command === 'start' && cli.flags.browsers) {
  config.devBrowserslist =
    cli.flags.browsers === 'false' ? false : cli.flags.browsers;
}

const projectDirectory = path.dirname(configPath);

(() => {
  if (command === 'write-babelrc') {
    writeBabelrc(config, {
      projectDirectory,
      outputDirectory: cli.flags.dir,
      target: cli.flags.target
    });
    return;
  }

  const executeCommand = commands[command];
  const emitter = executeCommand(config, projectDirectory);
  emitter.on(constants.EVENT_NOTIFICATION, (message) => {
    batfishLog.log(message);
  });
  emitter.on(constants.EVENT_ERROR, (error) => {
    const niceMessage = getLoggableErrorMessage(error);
    if (niceMessage) {
      batfishLog.error(niceMessage);
    } else {
      batfishLog.error(renderPrettyErrorStack(error));
    }
    if (command !== 'start') {
      process.exit(1);
    }
  });
})();
