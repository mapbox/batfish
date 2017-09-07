// @flow
'use strict';

const _ = require('lodash');
const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const EventEmitter = require('events');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const errorTypes = require('./error-types');
const wrapError = require('./wrap-error');
const constants = require('./constants');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackStatsError = require('./create-webpack-stats-error');
const watchContext = require('./watch-context');
const serverInitMessage = require('./server-init-message');
const writeWebpackStats = require('./write-webpack-stats');

// Returns an EventEmitter that fires notification and error events.
function watchWebpack(
  batfishConfig: BatfishConfiguration,
  server: BatfishServer
): EventEmitter {
  const emitter = new EventEmitter();
  const emitError = (error: Error) => {
    emitter.emit(constants.EVENT_ERROR, error);
  };
  const emitNotification = (message: string) => {
    emitter.emit(constants.EVENT_NOTIFICATION, message);
  };

  const htmlWebpackPluginOptions = {
    template: path.join(__dirname, '../webpack/html-webpack-template.ejs'),
    cssBasename: _.isEmpty(batfishConfig.stylesheets)
      ? ''
      : constants.BATFISH_CSS_BASENAME
  };
  let lastHash;
  let hasCompiled = false;

  createWebpackConfigClient(batfishConfig, {
    devServer: true
  })
    .then(clientConfig => {
      // Create an HTML file to load the assets in the browser.
      const config = webpackMerge(clientConfig, {
        plugins: [new HtmlWebpackPlugin(htmlWebpackPluginOptions)]
      });

      let compiler;
      try {
        compiler = webpack(config);
      } catch (compilerInitializationError) {
        emitError(
          wrapError(compilerInitializationError, errorTypes.WebpackFatalError)
        );
        return;
      }

      const onCompilation = (fatalError, stats) => {
        // Don't do anything if the compilation is just repetition.
        // There's often a series of many compilations with the same output.
        if (stats.hash === lastHash) return;
        lastHash = stats.hash;

        if (!hasCompiled) {
          hasCompiled = true;
          emitNotification(chalk.green.bold('Go!'));
          emitNotification(
            serverInitMessage(server.browserSyncInstance, batfishConfig)
          );
        }

        if (fatalError) {
          emitError(wrapError(fatalError, errorTypes.WebpackFatalError));
          return;
        }

        if (stats.hasErrors()) {
          emitError(createWebpackStatsError(stats));
        }

        writeWebpackStats(batfishConfig.outputDirectory, stats).catch(
          emitError
        );
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
      };

      compiler.watch(
        {
          ignored: [
            /node_modules/,
            path.join(batfishConfig.pagesDirectory, './**/*.{js,md}')
          ]
        },
        onCompilation
      );

      // Watch pages separately, so we can rewrite the context module, which
      // will capture changes to front matter, page additions and deletions.
      watchContext(batfishConfig, {
        onError: emitError,
        afterCompilation: () => {
          compiler.run(onCompilation);
        }
      });
    })
    .catch(emitError);

  return emitter;
}

module.exports = watchWebpack;
