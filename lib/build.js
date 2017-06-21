'use strict';

const webpack = require('webpack');
const globby = require('globby');
const path = require('path');
const pify = require('pify');
const mkdirp = require('mkdirp');
const cpFile = require('cp-file');
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
 * @param {string} projectDirectory
 * @return {Promise<void>} - Resolves when the build is complete.
 */
function build(rawConfig, projectDirectory) {
  if (rawConfig.production === undefined) {
    rawConfig = Object.assign({}, rawConfig, { production: true });
  }
  const batfishConfig = validateConfig(rawConfig, projectDirectory);
  const outdir = batfishConfig.outputDirectory;

  const assetDir = path.join(outdir, 'assets');
  const getAssetFilePath = assetPath => {
    const pathWithoutBase = path.relative(
      batfishConfig.siteBasePath,
      assetPath
    );
    return path.join(outdir, pathWithoutBase);
  };

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetDir
  });

  const nonPagesGlob = path.join(
    batfishConfig.pagesDirectory,
    '**/*.!(js|md|css)'
  );
  const copyNonPages = () => {
    return globby(nonPagesGlob).then(nonPagesPaths => {
      return Promise.all(
        nonPagesPaths.map(assetPath => {
          const rel = path.relative(batfishConfig.pagesDirectory, assetPath);
          const dest = path.join(batfishConfig.outputDirectory, rel);
          return cpFile(assetPath, dest);
        })
      );
    });
  };

  const buildClient = () =>
    createWebpackConfigClient(configOptions)
      .then(clientConfig => pify(webpack)(clientConfig))
      .then(stats => {
        // For bundle debugging, writing stats.json.
        return pify(mkdirp)(outdir).then(() =>
          pify(fs.writeFile)(
            path.join(outdir, 'stats.json'),
            JSON.stringify(stats.toJson())
          )
        );
      });
  const buildStatic = () =>
    createWebpackConfigStatic(configOptions).then(staticConfig =>
      pify(webpack)(staticConfig)
    );

  timelog('Starting the Webpack bundling');
  // First clear the output directory. Webpack will re-create it.
  return del(outdir, { force: true })
    .then(() => Promise.all([buildClient(), buildStatic(), copyNonPages()]))
    .then(() => {
      timelog('Successful Webpack bundling');
      return pify(fs.readFile)(path.join(assetDir, 'assets.json'), 'utf8');
    })
    .then(rawAssets => {
      const assets = JSON.parse(rawAssets);
      // Asset filenames in assets JSON are relative to the outputDirectory
      return pify(fs.readFile)(getAssetFilePath(assets.manifest.js), 'utf8')
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
          if (!batfishConfig.production) return;
          const cssPath = getAssetFilePath(assets.app.css);
          return inlineCss(outdir, cssPath);
        });
    })
    .then(() => {
      timelog('Successful static HTML build');
    });
}

module.exports = build;
