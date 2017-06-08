'use strict';

const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const pify = require('pify');
const _ = require('lodash');
const fs = require('fs');
const del = require('del');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const timelog = require('./timelog');

/**
 * Build static pages and assets, ready for deployment.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<>} - Resolves when the build is complete.
 */
function build(batfishConfig) {
  // Assign production defaults to config
  _.defaults(batfishConfig, {
    production: true
  });

  const assetOutputDirectory = path.join(
    batfishConfig.outputDirectory,
    'assets'
  );

  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetOutputDirectory
  });
  const clientConfig = createWebpackConfigClient(configOptions);
  const staticConfig = createWebpackConfigStatic(configOptions);

  timelog('Starting the Webpack bundling');
  const buildClient = pify(webpack)(clientConfig).then(stats => {
    return pify(fs.writeFile)(
      path.join(batfishConfig.outputDirectory, 'stats.json'),
      JSON.stringify(stats.toJson())
    );
  });
  const buildStatic = pify(webpack)(staticConfig);

  return del(batfishConfig.outputDirectory)
    .then(() => Promise.all([buildClient, buildStatic]))
    .then(() => {
      timelog('Successful Webpack bundling');
    })
    .then(() => {
      timelog('Starting static HTML build');
      const staticRenderPages = require(path.join(
        assetOutputDirectory,
        'static-render-pages.js'
      ));
      return staticRenderPages({
        outputDirectory: batfishConfig.outputDirectory
      });
    })
    .then(() => {
      timelog('Successful static HTML build');
    })
    .catch(error => {
      timelog(chalk.red.bold('Build error'));
      console.log(error.stack);
    });
}

module.exports = build;
