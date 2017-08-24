'use strict';

const webpack = require('webpack');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const _ = require('lodash');
const chokidar = require('chokidar');
const EventEmitter = require('events');
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
const wrapError = require('./wrap-error');
const createWebpackStatsError = require('./create-webpack-stats-error');

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
  const statsFilename = path.join(
    batfishConfig.outputDirectory,
    constants.STATS_BASENAME
  );
  const serveAssetsDir = joinUrlParts(
    batfishConfig.siteBasePath,
    constants.PUBLIC_PATH_ASSETS
  );
  // This allows us to serve static files within the pages directory.
  const servePagesDir = batfishConfig.siteBasePath;

  const server = browserSync.create();
  server.emitter.on('error', emitError);

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

  const getServerInstance = new Promise(resolve => {
    server.emitter.on('init', instance => {
      resolve(instance);
    });
  });

  const startServer = () => {
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

  const startWebpackWatcher = config => {
    let compiler;
    try {
      compiler = webpack(config);
    } catch (compilerInitializationError) {
      emitError(
        wrapError(compilerInitializationError, errorTypes.WebpackFatalError)
      );
      return;
    }

    let lastHash;
    let hasCompiled = false;
    compiler.watch(webpackWatchOptions, (fatalError, stats) => {
      // Don't do anything if the compilation is just repetition.
      // There's often a series of many compilations with the same output.
      if (stats.hash === lastHash) return;
      lastHash = stats.hash;

      if (!hasCompiled) {
        hasCompiled = true;
        emitNotification(chalk.green.bold('Go!'));
        getServerInstance
          .then(serverInstance => {
            emitNotification(serverInitMessage(serverInstance, batfishConfig));
          })
          .catch(emitError);
      }

      if (fatalError) {
        emitError(wrapError(fatalError, errorTypes.WebpackFatalError));
        return;
      }

      if (stats.hasErrors()) {
        emitError(createWebpackStatsError(stats));
      }

      const statsString = JSON.stringify(stats.toJson());
      pify(fs.writeFile)(statsFilename, statsString).catch(emitError);
      if (batfishConfig.verbose) {
        emitNotification(
          stats.toString({
            chunks: false,
            colors: true
          })
        );
      }
      emitNotification('Webpack finished compiling.');
      server.reload();
    });
  };

  createWebpackConfigClient(batfishConfig, { devServer: true })
    .then(clientConfig => {
      // Create an HTML file to load the assets in the browser.
      const config = webpackMerge(clientConfig, {
        plugins: [new HtmlWebpackPlugin(htmlWebpackPluginOptions)]
      });

      emitNotification('Starting the development server.');
      emitNotification(chalk.yellow.bold('Wait ...'));
      return Promise.resolve()
        .then(() => {
          if (batfishConfig.clearOutputDirectory) {
            return del(batfishConfig.outputDirectory, { force: true });
          }
        })
        .then(() => compileStylesheets(batfishConfig).catch(emitError))
        .then(() => {
          startServer();
          startCssWatcher();
          startWebpackWatcher(config);
        });
    })
    .catch(emitError);

  return emitter;
}

module.exports = start;
