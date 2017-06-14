'use strict';

const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const del = require('del');
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
 * Start the development build and server.
 *
 * @param {Object} rawConfig
 */
function start(rawConfig) {
  const batfishConfig = validateConfig(rawConfig);
  const server = browserSync.create();
  const exit = () => {
    server.exit();
    process.exit();
  };

  createWebpackConfigClient(batfishConfig, {
    devServer: true
  }).then(clientConfig => {
    // Create an HTML file to load the assets in the browser.
    const config = webpackMerge(clientConfig, {
      plugins: [new HtmlWebpackPlugin()]
    });

    const startServer = () => {
      process.on('SIGINT', exit);

      const assetsDir = batfishConfig.siteBasePath + '/assets';

      getPort(batfishConfig.port).then(availablePort => {
        server.emitter.on('init', instance => {
          logServerInit(instance, batfishConfig);
        });

        server.init({
          port: availablePort,
          server: {
            baseDir: batfishConfig.outputDirectory,
            routes: {
              [assetsDir]: batfishConfig.outputDirectory
            },
            middleware: [historyApiFallback()]
          },
          notify: false,
          open: false,
          files: [path.join(batfishConfig.outputDirectory, '*.*')],
          logLevel: 'silent',
          reloadDebounce: 500
        });
      });
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

    timelog('Starting your batfish development server');
    timelog(chalk.yellow.bold('Wait ...'));
    // timelog(`Pages available `);
    return del(batfishConfig.outputDirectory, { force: true }).then(() => {
      const compiler = webpack(config);
      startServer();
      let lastHash;
      let hasCompiled = false;
      compiler.watch({}, (fatalError, stats) => {
        if (!hasCompiled) {
          hasCompiled = true;
          timelog(chalk.green.bold('Go!'));
        }
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
  });
}

module.exports = start;
