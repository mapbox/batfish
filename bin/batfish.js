#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const path = require('path');
const timelog = require('../lib/timelog');
const start = require('../lib/start');
const build = require('../lib/build');
const serveStatic = require('../lib/serve-static');

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

${chalk.bold(`${chalk.magenta('build')} options`)}
  -d, --debug      Build for debugging, not for production.

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
    },
    default: {
      config: 'batfish.config.js'
    }
  }
);

const command = cli.input[0];
if (command === undefined || commands[command] === undefined) {
  timelog(`${chalk.red.bold('Error:')} You must specify a valid command.`);
  cli.showHelp();
}

const configPath = path.isAbsolute(cli.flags.config)
  ? cli.flags.config
  : path.join(process.cwd(), cli.flags.config);

let config;
try {
  config = require(configPath);
} catch (error) {
  timelog(
    `${chalk.red.bold(
      'Error:'
    )} Could not load configuration module from ${chalk.underline(configPath)}`
  );
  throw error;
}

if (cli.flags.production) {
  config = Object.assign({}, config, { production: cli.flags.production });
}

if (cli.flags.debug) {
  config = Object.assign({}, config, { production: !cli.flags.debug });
}
if (cli.flags.port) {
  config = Object.assign({}, config, { port: cli.flags.port });
}
if (cli.flags.verbose) {
  config = Object.assign({}, config, { verbose: cli.flags.verbose });
}

const executeCommand = commands[command];
executeCommand(config);
