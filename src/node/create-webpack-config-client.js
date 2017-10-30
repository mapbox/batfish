// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
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
        processOutput: x => JSON.stringify(x, null, 2)
      }),
      // Extract universal vendor files (defined above) from everything else.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),
      // Bundle together any other modules from anywhere imported more than 3 times.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        children: true,
        minChunks: 4
      }),
      // Trying to follow advice for long-term caching described here:
      // https://webpack.js.org/guides/caching/#extracting-boilerplate and
      // https://jeremygayed.com/dynamic-vendor-bundling-in-webpack-528993e48aab#.hjgai17ap
      // Because 'manifest' does not correspond to an entry name, this chunk
      // will include Webpack's runtime boilerplate and manifest, which can
      // change with each build. During the static build we inject it directly
      // into the HTML, so those variations do not ruin caching on large chunks.
      new webpack.optimize.CommonsChunkPlugin('manifest'),
      // Recommended at https://webpack.js.org/guides/caching/#module-identifiers
      // as a way to make module IDs more deterministic.
      new webpack.HashedModuleIdsPlugin(),
      // Define an environment variable for special cases
      new webpack.DefinePlugin({
        'process.env.DEV_SERVER': (options && options.devServer) || false
      })
    ].concat(batfishConfig.webpackPlugins || []);

    if (batfishConfig.production) {
      const uglifyPlugin = new UglifyPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebookincubator/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
          },
          output: {
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebookincubator/create-react-app/issues/2488
            ascii_only: true
          }
        }
      });
      clientPlugins.push(uglifyPlugin);
    }

    const appEntry = [];
    if (!batfishConfig.production && batfishConfig.inlineJs) {
      batfishConfig.inlineJs.forEach(jsData => {
        appEntry.push(jsData.filename);
      });
    }
    appEntry.push(path.join(__dirname, '../webpack/batfish-app.js'));

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
