'use strict';

const webpack = require('webpack');
const path = require('path');
const pify = require('pify');
const mkdirp = require('mkdirp');
const fs = require('fs');
const del = require('del');
const cpy = require('cpy');
const globby = require('globby');
const UglifyJs = require('uglify-js');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const timelog = require('./timelog');
const validateConfig = require('./validate-config');
const inlineCss = require('./inline-css');
const generateSitemap = require('./generate-sitemap');

/**
 * Build static pages and assets, ready for deployment.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} projectDirectory
 * @return {Promise<void>} - Resolves when the build is complete.
 */
function build(rawConfig, projectDirectory) {
  rawConfig = rawConfig || {};
  if (rawConfig.production === undefined) {
    rawConfig = Object.assign({}, rawConfig, { production: true });
  }
  const batfishConfig = validateConfig(rawConfig, projectDirectory);
  const outdir = batfishConfig.outputDirectory;

  const assetDir = path.join(outdir, 'assets');
  const getAssetFilePath = assetPath => {
    const pathWithoutBase = assetPath.replace(
      new RegExp(`^${batfishConfig.siteBasePath}`),
      ''
    );
    return path.join(outdir, pathWithoutBase);
  };

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetDir
  });

  const copyNonPages = () => {
    return cpy('**/*.!(js|md|css)', batfishConfig.outputDirectory, {
      cwd: batfishConfig.pagesDirectory,
      parents: true
    });
  };

  const copyStatic = () => {
    return cpy('**/*.*', path.join(batfishConfig.outputDirectory, 'static'), {
      cwd: batfishConfig.staticDirectory,
      parents: true
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
  const buildStatic = () => {
    return createWebpackConfigStatic(configOptions).then(staticConfig =>
      pify(webpack)(staticConfig)
    );
  };
  const getPageSpecificCssPaths = () => {
    return globby(path.join(batfishConfig.pagesDirectory, '**/*.css'));
  };

  timelog('Starting the Webpack bundling');
  // First clear the output directory. Webpack will re-create it.
  return del(outdir, { force: true })
    .then(() => {
      timelog('Bundling for client');
      return buildClient();
    })
    .then(() => {
      timelog('Bundling for static pages');
      return buildStatic();
    })
    .then(() => Promise.all([copyNonPages(), copyStatic()]))
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
          const uglifiedManifestJs = UglifyJs.minify(manifestJs, {
            fromString: true
          }).code;
          const staticRenderPages = require(path.join(
            assetDir,
            'static-render-pages.js'
          ));
          return staticRenderPages(batfishConfig, assets, uglifiedManifestJs);
        })
        .then(() => {
          if (!batfishConfig.production) return;
          return getPageSpecificCssPaths();
        })
        .then(pageSpecificCssPaths => {
          const cssPaths = [getAssetFilePath(assets.app.css)]
            .concat(pageSpecificCssPaths)
            .filter(x => !!x);
          return inlineCss(outdir, cssPaths);
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
