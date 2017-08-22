'use strict';

const webpack = require('webpack');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chokidar = require('chokidar');
const getPort = require('get-port');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const createWebpackConfigClient = require('./create-webpack-config-client');
const timelog = require('./timelog');
const constants = require('./constants');
const validateConfig = require('./validate-config');
const logServerInit = require('./log-server-init');
const compileStylesheets = require('./compile-stylesheets');
const joinUrlParts = require('./join-url-parts');

const webpackWatchOptions = {
  ignored: /node_modules/
};

/**
 * Start the development server and Webpack watcher.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} [projectDirectory]
 */
function start(rawConfig, projectDirectory) {
  rawConfig = rawConfig || {};
  const batfishConfig = validateConfig(rawConfig, projectDirectory);
  const stylesheetsIsEmpty = _.isEmpty(batfishConfig.stylesheets);
  const server = browserSync.create();
  const exit = () => {
    server.exit();
    process.exit();
  };
  const statsFilename = path.join(batfishConfig.outputDirectory, 'stats.json');
  const htmlWebpackPluginOptions = {
    template: path.join(__dirname, '../src/html-webpack-template.ejs'),
    cssBasename: stylesheetsIsEmpty ? '' : constants.BATFISH_CSS_BASENAME
  };

  createWebpackConfigClient(batfishConfig, {
    devServer: true
  }).then(clientConfig => {
    // Create an HTML file to load the assets in the browser.
    const config = webpackMerge(clientConfig, {
      plugins: [new HtmlWebpackPlugin(htmlWebpackPluginOptions)]
    });
    config.stats = 'normal';

    const getServerInstance = new Promise(resolve => {
      server.emitter.on('init', instance => {
        resolve(instance);
      });
    });

    const startServer = () => {
      process.on('SIGINT', exit);

      const serveAssetsDir = joinUrlParts(
        batfishConfig.siteBasePath,
        constants.PUBLIC_PATH_ASSETS
      );
      // This allows us to serve static files within the pages directory.
      const servePagesDir = batfishConfig.siteBasePath;

      getPort(batfishConfig.port).then(availablePort => {
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
      });
    };

    const startCssWatcher = () => {
      if (stylesheetsIsEmpty) return;
      const cssWatcher = chokidar.watch(batfishConfig.stylesheets);
      cssWatcher.on('change', () => {
        compileStylesheets(batfishConfig).then(compiledFilename => {
          timelog('Recompiled CSS');
          server.reload(compiledFilename);
        });
      });
    };

    const logFatalError = error => {
      timelog(chalk.red.bold('Webpack compilation error!'));
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

    const startWebpackWatcher = () => {
      const compiler = webpack(config);
      let lastHash;
      let hasCompiled = false;
      compiler.watch(webpackWatchOptions, (fatalError, stats) => {
        if (!hasCompiled) {
          hasCompiled = true;
          timelog(chalk.green.bold('Go!'));
          getServerInstance.then(serverInstance => {
            logServerInit(serverInstance, batfishConfig);
          });
        }
        if (fatalError) {
          logFatalError(fatalError);
          return exit();
        }
        logStatsErrors(stats);
        const statsString = JSON.stringify(stats.toJson());
        fs.writeFile(statsFilename, statsString, err => {
          if (err) {
            console.error('Error writing stats.json');
            console.error(err);
          }
        });
        if (batfishConfig.verbose) {
          console.log(
            stats.toString({
              chunks: false,
              colors: true
            })
          );
        }
        if (stats.hash === lastHash) return;
        lastHash = stats.hash;
        timelog('Webpack finished compiling');
        server.reload();
      });
    };

    timelog('Starting your batfish development server');
    timelog(chalk.yellow.bold('Wait ...'));
    const clearTheWay = batfishConfig.clearOutputDirectory
      ? del(batfishConfig.outputDirectory, { force: true })
      : Promise.resolve();
    return clearTheWay
      .then(() => compileStylesheets(batfishConfig))
      .then(() => {
        startServer();
        startCssWatcher();
        startWebpackWatcher();
      })
      .catch(error => {
        console.error(error.stack);
      });
  });
}

module.exports = start;
