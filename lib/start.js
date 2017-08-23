'use strict';

const webpack = require('webpack');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chokidar = require('chokidar');
const EventEmitter = require('eventemitter3');
const getPort = require('get-port');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const createWebpackConfigClient = require('./create-webpack-config-client');
const constants = require('./constants');
const validateConfig = require('./validate-config');
const serverInitMessage = require('./server-init-message');
const compileStylesheets = require('./compile-stylesheets');
const joinUrlParts = require('./join-url-parts');
const errorTypes = require('./error-types');

const webpackWatchOptions = {
  ignored: /node_modules/
};

/**
 * Start the development server and Webpack watcher.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} [projectDirectory]
 * @return {EventEmitter} An EventEmitter that emits the following events:
 * - 'error'
 * - 'notification'
 * - 'exit'
 */
function start(rawConfig, projectDirectory) {
  rawConfig = rawConfig || {};
  const emitter = new EventEmitter();
  const emitError = error => {
    emitter.emit('error', error);
  };
  const emitNotification = message => {
    emitter.emit('notification', message);
  };

  let batfishConfig;
  try {
    batfishConfig = validateConfig(rawConfig, projectDirectory);
  } catch (configValidationError) {
    // setImmediate allows us to return the emitter before emitting the error.
    setImmediate(() => {
      emitError(configValidationError);
    });
    return emitter;
  }

  const stylesheetsIsEmpty = _.isEmpty(batfishConfig.stylesheets);
  const htmlWebpackPluginOptions = {
    template: path.join(__dirname, '../src/html-webpack-template.ejs'),
    cssBasename: stylesheetsIsEmpty ? '' : constants.BATFISH_CSS_BASENAME
  };
  const statsFilename = path.join(batfishConfig.outputDirectory, 'stats.json');
  const serveAssetsDir = joinUrlParts(
    batfishConfig.siteBasePath,
    constants.PUBLIC_PATH_ASSETS
  );
  // This allows us to serve static files within the pages directory.
  const servePagesDir = batfishConfig.siteBasePath;
  const compilationHashes = new Set();

  const server = browserSync.create();
  server.emitter.on('error', emitError);

  const exit = () => {
    server.exit();
    process.exit();
  };

  const startCssWatcher = () => {
    if (stylesheetsIsEmpty) return;
    const cssWatcher = chokidar.watch(batfishConfig.stylesheets);
    cssWatcher.on('change', () => {
      compileStylesheets(batfishConfig)
        .then(compiledFilename => {
          emitNotification('CSS finished compiling.');
          server.reload(compiledFilename);
        })
        .catch(emitError);
    });
    cssWatcher.on('error', emitError);
  };

  const emitStatsErrors = stats => {
    if (!stats.hasErrors()) return;
    const typedError = new errorTypes.WebpackCompilationError();
    typedError.stats = stats;
    emitError(typedError);
  };

  const logFatalError = error => {
    const typedError = new errorTypes.WebpackFatalError();
    typedError.originalError = error;
    emitError(typedError);
  };

  const getServerInstance = new Promise(resolve => {
    server.emitter.on('init', instance => {
      resolve(instance);
    });
  });

  const startServer = () => {
    // If the user hits ctrl+C, make sure BrowserSync exits.
    process.on('SIGINT', exit);

    getPort(batfishConfig.port)
      .then(availablePort => {
        server.init({
          port: availablePort,
          server: {
            baseDir: batfishConfig.outputDirectory,
            routes: {
              [serveAssetsDir]: batfishConfig.outputDirectory,
              [servePagesDir]: batfishConfig.pagesDirectory
            },
            middleware: [historyApiFallback()]
          },
          notify: false,
          open: false,
          logLevel: 'silent',
          reloadDebounce: 500,
          offline: true,
          injectChanges: true
        });
      })
      .catch(emitError);
  };

  createWebpackConfigClient(batfishConfig, {
    devServer: true
  })
    .then(clientConfig => {
      // Create an HTML file to load the assets in the browser.
      const config = webpackMerge(clientConfig, {
        plugins: [new HtmlWebpackPlugin(htmlWebpackPluginOptions)]
      });
      config.stats = 'normal';

      const startWebpackWatcher = () => {
        let compiler;
        try {
          compiler = webpack(config);
        } catch (compilerInitializationError) {
          logFatalError(compilerInitializationError);
          exit();
        }
        let lastHash;
        let hasCompiled = false;
        compiler.watch(webpackWatchOptions, (fatalError, stats) => {
          // Don't do anything if the compilation is just repetition.
          // There's often a series of many compilations with the same output.
          if (compilationHashes.has(stats.hash)) {
            return;
          }
          compilationHashes.add(stats.hash);

          if (!hasCompiled) {
            hasCompiled = true;
            emitNotification(chalk.green.bold('Go!'));
            getServerInstance
              .then(serverInstance => {
                emitNotification(
                  serverInitMessage(serverInstance, batfishConfig)
                );
              })
              .catch(emitError);
          }
          if (fatalError) {
            logFatalError(fatalError);
            exit();
          }
          emitStatsErrors(stats);
          const statsString = JSON.stringify(stats.toJson());
          fs.writeFile(statsFilename, statsString, writeStatsError => {
            if (writeStatsError) {
              emitError(writeStatsError);
            }
          });
          if (batfishConfig.verbose) {
            emitNotification(
              stats.toString({
                chunks: false,
                colors: true
              })
            );
          }
          if (stats.hash === lastHash) return;
          lastHash = stats.hash;
          emitNotification('Webpack finished compiling.');
          server.reload();
        });
      };

      emitNotification('Starting the development server.');
      emitNotification(chalk.yellow.bold('Wait ...'));
      const clearTheWay = batfishConfig.clearOutputDirectory
        ? del(batfishConfig.outputDirectory, { force: true })
        : Promise.resolve();
      return clearTheWay
        .then(() => compileStylesheets(batfishConfig).catch(emitError))
        .then(() => {
          startServer();
          startCssWatcher();
          startWebpackWatcher();
        });
    })
    .catch(emitError);

  return emitter;
}

module.exports = start;
