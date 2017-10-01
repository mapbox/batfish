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
const MinifyPlugin = require('babel-minify-webpack-plugin');

// These browsers support classes and arrow functions. The runtime test
// in static-render-pages checks for these two features when determining
// which build to load.
const modernBabelPresetEnvOptions = {
  useBuiltIns: true,
  targets: {
    browsers: [
      'Edge >= 13', // Should be 12?
      'Firefox >= 45',
      'Chrome >= 49',
      'Safari >= 10',
      'iOS >= 10.2',
      'Opera >= 36'
    ]
  }
};

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
  options?: {
    // Indicates that we're building this for the development server, not for the
    // static build.
    devServer?: boolean,
    // Indicates that we're making a modern build.
    modern?: boolean
  } = {}
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
  const filenamePrefix = options.modern ? `m-` : '';

  const tailoredBatfishConfig = !options.modern
    ? batfishConfig
    : Object.assign({}, batfishConfig, {
        babelPresetEnvOptions: modernBabelPresetEnvOptions
      });

  return createWebpackConfigBase(tailoredBatfishConfig).then(baseConfig => {
    let vendorModules = [
      reactPath,
      reactDomPath,
      reactHelmetPath,
      require.resolve('@mapbox/scroll-restorer'),
      require.resolve('@mapbox/link-hijacker')
    ];
    if (batfishConfig.includePromisePolyfill && !options.modern) {
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
        filename: `${filenamePrefix}assets.json`,
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
      new webpack.optimize.CommonsChunkPlugin('runtime'),
      // Define an environment variable for special cases.
      new webpack.DefinePlugin({
        'process.env.DEV_SERVER': options.devServer || false
      })
    ].concat(batfishConfig.webpackPlugins || []);

    if (batfishConfig.production) {
      let minifyPlugin;
      if (options.modern) {
        minifyPlugin = new MinifyPlugin();
      } else {
        minifyPlugin = new ParallelUglifyPlugin({
          sourceMap: !!batfishConfig.productionDevtool
        });
      }
      clientPlugins.push(minifyPlugin);
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
          : `${filenamePrefix}[name]-[chunkhash].js`,
        chunkFilename: !batfishConfig.production
          ? '[name].chunk.js'
          : `${filenamePrefix}[name]-[chunkhash].chunk.js`
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
