'use strict';

const webpack = require('webpack');
const path = require('path');
const pify = require('pify');
const fs = require('fs');
const del = require('del');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const timelog = require('./timelog');
const validateConfig = require('./validate-config');

/**
 * Build static pages and assets, ready for deployment.
 *
 * @param {Object} rawConfig
 * @return {Promise<void>} - Resolves when the build is complete.
 */
function build(rawConfig) {
  const batfishConfig = validateConfig(rawConfig);

  const assetOutputDirectory = path.join(
    batfishConfig.outputDirectory,
    'assets'
  );

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetOutputDirectory
  });

  timelog('Starting the Webpack bundling');
  const buildClient = createWebpackConfigClient(configOptions)
    .then(clientConfig => pify(webpack)(clientConfig))
    .then(stats => {
      // For bundle debugging, writing stats.json.
      return pify(fs.writeFile)(
        path.join(batfishConfig.outputDirectory, 'stats.json'),
        JSON.stringify(stats.toJson())
      );
    });
  const buildStatic = createWebpackConfigStatic(
    configOptions
  ).then(staticConfig => pify(webpack)(staticConfig));

  // First clear the output directory. Webpack will re-create it.
  return del(batfishConfig.outputDirectory, { force: true })
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
      return staticRenderPages(batfishConfig);
    })
    .then(() => {
      timelog('Successful static HTML build');
    });
}

module.exports = build;
