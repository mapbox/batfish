'use strict';

const webpack = require('webpack');
const path = require('path');
const pify = require('pify');
const chalk = require('chalk');
const fs = require('fs');
const del = require('del');
const cpy = require('cpy');
const _ = require('lodash');
const UglifyJs = require('uglify-js');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const timelog = require('./timelog');
const validateConfig = require('./validate-config');
const inlineCss = require('./inline-css');
const generateSitemap = require('./generate-sitemap');
const compileStylesheets = require('./compile-stylesheets');
const joinUrlParts = require('./join-url-parts');
const constants = require('./constants');

/**
 * Build static pages and assets, ready for deployment.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} projectDirectory
 * @return {Promise<void>} - Resolves when the build is complete.
 */
function build(rawConfig, projectDirectory) {
  rawConfig = Object.assign(
    {
      production: true
    },
    rawConfig
  );
  const batfishConfig = validateConfig(rawConfig, projectDirectory);
  const stylesheetsIsEmpty = _.isEmpty(batfishConfig.stylesheets);
  const outputDirectory = batfishConfig.outputDirectory;
  const assetsDirectory = path.join(
    outputDirectory,
    constants.PUBLIC_PATH_ASSETS
  );

  const getAssetFilePath = assetPath => {
    const pathWithoutBase = assetPath.replace(
      new RegExp(`^${batfishConfig.siteBasePath}`),
      ''
    );
    return path.join(outputDirectory, pathWithoutBase);
  };

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetsDirectory
  });

  const copyNonPages = () => {
    // Don't copy .js, .md, and .css files, which are already incorporated into
    // the build in other ways.
    return cpy('**/*.!(js|md|css)', batfishConfig.outputDirectory, {
      cwd: batfishConfig.pagesDirectory,
      parents: true
    });
  };

  const buildClient = () => {
    return createWebpackConfigClient(configOptions)
      .then(clientConfig => pify(webpack)(clientConfig))
      .then(stats => {
        // For bundle debugging, write stats.json.
        return pify(fs.writeFile)(
          path.join(outputDirectory, 'stats.json'),
          JSON.stringify(stats.toJson())
        );
      });
  };

  const buildStatic = () => {
    return createWebpackConfigStatic(configOptions).then(staticConfig =>
      pify(webpack)(staticConfig)
    );
  };

  timelog('Starting the Webpack bundling');
  const start = batfishConfig.clearOutputDirectory
    ? del(outputDirectory, { force: true })
    : Promise.resolve();
  let cssFilename;
  return start
    .then(() => {
      if (stylesheetsIsEmpty) return;
      timelog('Compiling CSS');
      return compileStylesheets(
        batfishConfig,
        assetsDirectory
      ).then(filename => {
        cssFilename = filename;
      });
    })
    .then(() => {
      timelog('Creating the client bundle');
      return buildClient();
    })
    .then(() => {
      timelog('Creating the static-page-rendering bundle');
      return buildStatic();
    })
    .then(() => {
      timelog('Copying files');
      return Promise.all([copyNonPages()]);
    })
    .then(() => {
      return pify(fs.readFile)(
        path.join(assetsDirectory, 'assets.json'),
        'utf8'
      );
    })
    .then(rawAssets => {
      const assets = JSON.parse(rawAssets);
      const manifestJs = fs.readFileSync(
        getAssetFilePath(assets.manifest.js),
        'utf8'
      );

      timelog('Starting static HTML build');
      const uglifiedManifestJs = UglifyJs.minify(manifestJs, {
        fromString: true
      }).code;

      const cssUrl = stylesheetsIsEmpty
        ? undefined
        : joinUrlParts(
            batfishConfig.siteBasePath,
            constants.PUBLIC_PATH_ASSETS,
            path.basename(cssFilename)
          );

      let staticRenderPages;
      try {
        staticRenderPages = require(path.join(
          assetsDirectory,
          'static-render-pages.js'
        )).default;
        return staticRenderPages(
          batfishConfig,
          assets,
          uglifiedManifestJs,
          cssUrl
        ).catch(error => {
          timelog(
            `${chalk.red.bold(
              'Error executing static-render-pages.js.'
            )} You may be importing a JS file that cannot run in Node.`
          );
          throw error;
        });
      } catch (requireError) {
        timelog(`${chalk.red.bold('Error parsing static-render-pages.js')}`);
        throw requireError;
      }
    })
    .then(() => {
      if (!batfishConfig.production || stylesheetsIsEmpty) return;
      return inlineCss(outputDirectory, cssFilename, {
        verbose: batfishConfig.verbose
      });
    })
    .then(() => {
      if (batfishConfig.siteOrigin) {
        timelog('Building the sitemap');
        return generateSitemap(batfishConfig);
      } else {
        timelog('siteOrigin is not specified, unable to generate sitemap');
      }
    })
    .then(() => {
      timelog('Successful static HTML build');
    });
}

module.exports = build;
