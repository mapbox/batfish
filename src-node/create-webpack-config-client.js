// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const resolveFrom = require('resolve-from');
const createWebpackConfigBase = require('./create-webpack-config-base');

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
  batfishConfig: BatfishConfiguration,
  options?: { devServer?: boolean }
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
  return createWebpackConfigBase(batfishConfig).then(baseConfig => {
    let vendorModules = [
      reactPath,
      reactDomPath,
      reactHelmetPath,
      require.resolve('@mapbox/scroll-restorer'),
      require.resolve('@mapbox/link-hijacker'),
      require.resolve('strip-color')
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
        processOutput: x => JSON.stringify(x, null, 2)
      }),
      // Extract universal vendor files (defined above) from everything else.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      // Bundle together any other modules from anywhere imported more than 3 times.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        children: true,
        minChunks: 4
      }),
      // Trying to follow advice for long-term caching described here:
      // https://jeremygayed.com/dynamic-vendor-bundling-in-webpack-528993e48aab#.hjgai17ap
      new webpack.optimize.CommonsChunkPlugin('manifest'),
      // Define an environment variable for special cases
      new webpack.DefinePlugin({
        'process.env.DEV_SERVER': options && options.devServer
      })
    ].concat(batfishConfig.webpackPlugins || []);
    const uglifyPlugin = new ParallelUglifyPlugin({
      sourceMap: !!batfishConfig.productionDevtool,
      uglifyJS: {
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      }
    });
    if (batfishConfig.production) {
      clientPlugins.push(uglifyPlugin);
    }

    const appEntry = [];
    if (!batfishConfig.production && batfishConfig.inlineJs) {
      batfishConfig.inlineJs.forEach(jsData => {
        appEntry.push(jsData.filename);
      });
    }
    appEntry.push(path.join(__dirname, '../src-webpack/batfish-app.js'));

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
      plugins: clientPlugins
    };

    let config = webpackMerge(baseConfig, clientConfig);
    if (batfishConfig.webpackConfigClientTransform) {
      config = batfishConfig.webpackConfigClientTransform(config);
    }
    return config;
  });
}

module.exports = createWebpackConfigClient;
