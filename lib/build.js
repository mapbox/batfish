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
const prepareInlineJs = require('./prepare-inline-js');
const inlineCss = require('./inline-css');

/**
 * Build static pages and assets, ready for deployment.
 *
 * @param {Object} rawConfig
 * @return {Promise<void>} - Resolves when the build is complete.
 */
function build(rawConfig) {
  const batfishConfig = validateConfig(rawConfig);
  const outdir = batfishConfig.outputDirectory;

  const assetDir = path.join(outdir, 'assets');

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetDir
  });

  timelog('Starting the Webpack bundling');
  const buildClient = createWebpackConfigClient(configOptions)
    .then(clientConfig => pify(webpack)(clientConfig))
    .then(stats => {
      // For bundle debugging, writing stats.json.
      return pify(fs.writeFile)(
        path.join(outdir, 'stats.json'),
        JSON.stringify(stats.toJson())
      );
    });
  const buildStatic = createWebpackConfigStatic(
    configOptions
  ).then(staticConfig => pify(webpack)(staticConfig));

  // First clear the output directory. Webpack will re-create it.
  return del(outdir, { force: true })
    .then(() => Promise.all([buildClient, buildStatic]))
    .then(() => {
      timelog('Successful Webpack bundling');
      return pify(fs.readFile)(path.join(assetDir, 'assets.json'), 'utf8');
    })
    .then(rawAssets => {
      const assets = JSON.parse(rawAssets);
      // Asset filenames in assets JSON are relative to the outputDirectory
      return pify(fs.readFile)(path.join(outdir, assets.manifest.js), 'utf8')
        .then(manifestJs => {
          timelog('Starting static HTML build');
          const inlineReadyManifestJs = prepareInlineJs(manifestJs);
          const staticRenderPages = require(path.join(
            assetDir,
            'static-render-pages.js'
          ));
          return staticRenderPages(
            batfishConfig,
            assets,
            inlineReadyManifestJs
          );
        })
        .then(() => {
          const cssPath = path.join(outdir, assets.app.css);
          return inlineCss(outdir, cssPath);
        });
    })
    .then(() => {
      timelog('Successful static HTML build');
    });
}

module.exports = build;
