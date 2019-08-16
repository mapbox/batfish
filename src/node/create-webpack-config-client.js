// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const resolveFrom = require('resolve-from');
const createWebpackConfigBase = require('./create-webpack-config-base');
const constants = require('./constants');

// We need the directory for the module instead of the filename to its main
// file.
function resolveModuleDirectoryFrom(src: string, name: string): string {
  return resolveFrom(src, name).replace(
    /node_modules\/([^/]+).*$/,
    'node_modules/$1'
  );
}

// Create a Webpack configuration for all the assets that will be loaded by the client.
function createWebpackConfigClient(
  batfishConfig: BatfishConfiguration
): Promise<webpack$Configuration> {
  // Resolve these peerDependencies from the pagesDirectory so we are sure
  // to get the same version that the pages are getting. Alias them below.
  const reactPath = resolveModuleDirectoryFrom(
    batfishConfig.pagesDirectory,
    'react'
  );
  const reactDomPath = resolveModuleDirectoryFrom(
    batfishConfig.pagesDirectory,
    'react-dom'
  );
  const reactHelmetPath = resolveModuleDirectoryFrom(
    batfishConfig.pagesDirectory,
    'react-helmet'
  );
  return createWebpackConfigBase(batfishConfig, {
    target: constants.TARGET_BROWSER
  }).then((baseConfig) => {
    let vendorModules = [
      reactPath,
      reactDomPath,
      reactHelmetPath,
      require.resolve('@mapbox/scroll-restorer'),
      require.resolve('@mapbox/link-hijacker')
    ];
    if (batfishConfig.includePromisePolyfill) {
      vendorModules.unshift(require.resolve('es6-promise/auto'));
    }
    if (batfishConfig.vendorModules !== undefined) {
      vendorModules = vendorModules.concat(batfishConfig.vendorModules);
    }

    const clientPlugins = [
      // Emit a file with assets' paths.
      // This is used in build processes to grab built files, whose names
      // include hashes so cannot be known without this dictionary.
      new AssetsPlugin({
        path: path.resolve(batfishConfig.outputDirectory),
        filename: 'assets.json',
        processOutput: (x) => JSON.stringify(x, null, 2)
      })
    ].concat(batfishConfig.webpackPlugins || []);

    const appEntry = [];
    if (!batfishConfig.production && batfishConfig.inlineJs) {
      batfishConfig.inlineJs.forEach((jsData) => {
        appEntry.push(jsData.filename);
      });
    }

    if (batfishConfig.spa) {
      appEntry.push(
        path.join(__dirname, '../webpack/render-batfish-spa-app.js')
      );
    } else {
      appEntry.push(path.join(__dirname, '../webpack/render-batfish-app.js'));
    }

    const clientConfig: webpack$Configuration = {
      entry: {
        app: appEntry,
        vendor: vendorModules
      },
      output: {
        filename: !batfishConfig.production
          ? '[name].js'
          : '[name]-[chunkhash].js',
        chunkFilename: !batfishConfig.production
          ? '[name].chunk.js'
          : '[name]-[chunkhash].chunk.js'
      },
      resolve: {
        alias: Object.assign({}, _.get(baseConfig, 'resolve.alias'), {
          react: reactPath,
          'react-dom': reactDomPath,
          'react-helmet': reactHelmetPath
        })
      },
      target: 'web',
      plugins: clientPlugins,
      // This helps us import more libraries with fewer errors.
      node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
      },
      optimization: {
        moduleIds: 'hashed',
        runtimeChunk: {
          name: 'manifest'
        }
      }
    };

    let config = webpackMerge(baseConfig, clientConfig);
    if (batfishConfig.webpackConfigClientTransform) {
      config = batfishConfig.webpackConfigClientTransform(config);
    }
    return config;
  });
}

module.exports = createWebpackConfigClient;
