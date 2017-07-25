'use strict';

const webpack = require('webpack');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const path = require('path');
const getPort = require('get-port');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const createWebpackConfigClient = require('./create-webpack-config-client');
const timelog = require('./timelog');
const validateConfig = require('./validate-config');
const logServerInit = require('./log-server-init');

/**
 * Start the development server and Webpack watcher.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} [projectDirectory]
 */
function start(rawConfig, projectDirectory) {
  rawConfig = rawConfig || {};
  const batfishConfig = validateConfig(rawConfig, projectDirectory);
  const server = browserSync.create();
  const exit = () => {
    server.exit();
    process.exit();
  };
  const statsFilename = path.join(batfishConfig.outputDirectory, 'stats.json');

  createWebpackConfigClient(batfishConfig, {
    devServer: true
  }).then(clientConfig => {
    // Create an HTML file to load the assets in the browser.
    const config = webpackMerge(clientConfig, {
      plugins: [new HtmlWebpackPlugin()]
    });
    config.stats = 'normal';

    const getServerInstance = new Promise(resolve => {
      server.emitter.on('init', instance => {
        resolve(instance);
      });
    });

    const startServer = () => {
      process.on('SIGINT', exit);

      const serveAssetsDir = batfishConfig.siteBasePath + '/assets';
      const serveStaticDir = batfishConfig.siteBasePath + '/static';
      // This allows us to serve static files within the pages directory.
      const servePagesDir = batfishConfig.siteBasePath;

      getPort(batfishConfig.port).then(availablePort => {
        server.init({
          port: availablePort,
          server: {
            baseDir: batfishConfig.outputDirectory,
            routes: {
              [serveAssetsDir]: batfishConfig.outputDirectory,
              [serveStaticDir]: batfishConfig.staticDirectory,
              [servePagesDir]: batfishConfig.pagesDirectory
            },
            middleware: [historyApiFallback()]
          },
          notify: false,
          open: false,
          logLevel: 'silent',
          reloadDebounce: 500,
          offline: true
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

    timelog('Starting your batfish development server');
    timelog(chalk.yellow.bold('Wait ...'));
    const start = batfishConfig.clearOutputDirectory
      ? del(batfishConfig.outputDirectory, { force: true })
      : Promise.resolve();
    return start.then(() => {
      const compiler = webpack(config);
      startServer();
      let lastHash;
      let hasCompiled = false;
      compiler.watch(
        {
          ignored: /node_modules/
        },
        (fatalError, stats) => {
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
          fs.writeFile(statsFilename, JSON.stringify(stats.toJson()), err => {
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
        }
      );
    });
  });
}

module.exports = start;
