'use strict';

const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const del = require('del');
const getPort = require('get-port');
const _ = require('lodash');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const createWebpackConfigClient = require('./create-webpack-config-client');
const timelog = require('./timelog');

/**
 * Start the development build and server.
 *
 * @param {Object} options
 * @param {String} options.entry
 * @param {String} options.sourceDirectory
 * @param {String} options.outputDirectory
 * @param {Array<string>} [options.vendor]
 * @param {boolean} [options.debug=true]
 * @param {number} [options.port=8080]
 */
function start(options) {
  _.defaults(options, {
    debug: true,
    port: 8080
  });

  const bsServer = browserSync.create();

  const exit = () => {
    bsServer.exit();
    process.exit();
  };

  const clientConfig = createWebpackConfigClient(
    _.pick(options, [
      'debug',
      'entry',
      'sourceDirectory',
      'outputDirectory',
      'vendor'
    ])
  );

  // Create an HTML file to load the asssets in the browser.
  const config = webpackMerge(clientConfig, {
    plugins: [new HtmlWebpackPlugin()]
  });

  const startServer = () => {
    getPort(options.port).then(availablePort => {
      bsServer.init({
        port: availablePort,
        server: {
          baseDir: options.outputDirectory,
          routes: {
            '/assets': options.outputDirectory
          },
          middleware: [historyApiFallback()]
        },
        open: false,
        notify: false,
        files: [path.join(options.outputDirectory, '*.*')],
        logFileChanges: false,
        reloadDebounce: 500
      });
    });

    process.on('SIGINT', exit);
  };

  const logFatalError = error => {
    console.error(error.stack || error);
    if (error.details) console.error(error.details);
  };

  const logStatsErrors = stats => {
    if (!stats.hasErrors()) return;
    const info = stats.toJson();
    info.errors.forEach(error => {
      console.error(error);
    });
  };

  timelog(chalk.cyan('Starting your batfish development server'));
  return del(options.outputDirectory).then(() => {
    const compiler = webpack(config);
    startServer();
    let lastHash;
    compiler.watch({}, (fatalError, stats) => {
      if (fatalError) {
        logFatalError(fatalError);
        return exit();
      }
      logStatsErrors(stats);
      if (stats.hash === lastHash) return;
      lastHash = stats.hash;
      timelog('Webpack finished compiling');
    });
  });
}

module.exports = start;
