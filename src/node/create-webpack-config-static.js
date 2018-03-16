// @flow
'use strict';

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const createWebpackConfigBase = require('./create-webpack-config-base');
const constants = require('./constants');

const reactComponentStubPath = path.join(
  __dirname,
  './static-stubs/react-component.js'
);

// Create a Webpack configuration that compiles static-render-pages.js,
// a Node module that will build HTML pages.
function createWebpackConfigStatic(
  batfishConfig: BatfishConfiguration
): Promise<webpack$Configuration> {
  return createWebpackConfigBase(batfishConfig, {
    target: constants.TARGET_NODE
  }).then(baseConfig => {
    const staticConfig: webpack$Configuration = {
      entry: {
        static: path.join(__dirname, '../webpack/static-render-pages.js')
      },
      output: {
        filename: './static-render-pages.js',
        libraryTarget: 'commonjs2'
      },
      target: 'node',
      externals: {
        // These modules are required by static-render-pages and don't play
        // nice when Webpack tries to compile them, or we know they can be
        // loaded in Node.
        'uglify-js': require.resolve('uglify-js'),
        mkdirp: require.resolve('mkdirp'),
        react: 'react',
        'react-dom': 'react-dom'
      },
      plugins: [
        // Ensure that all files will be grouped into one file,
        // even if they would otherwise be split into separate chunks.
        // Separate chunks serve no purpose in the static build: we need all
        // the information at once.
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
      ],
      devtool: 'source-map',
      // Don't hijack Node's globals: this code will execute in Node.
      node: {
        console: false,
        global: false,
        process: false,
        __filename: false,
        __dirname: false,
        Buffer: false,
        setImmediate: false
      }
    };

    if (batfishConfig.webpackStaticIgnore) {
      _.set(staticConfig, 'module.rules[0]', {
        test: batfishConfig.webpackStaticIgnore,
        loader: 'ignore-loader'
      });
    }

    batfishConfig.webpackStaticStubReactComponent.forEach(original => {
      if (!staticConfig.plugins) staticConfig.plugins = [];
      staticConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          new RegExp(_.escapeRegExp(original)),
          reactComponentStubPath
        )
      );
    });

    let config = webpackMerge(baseConfig, staticConfig);
    if (batfishConfig.webpackConfigStaticTransform) {
      config = batfishConfig.webpackConfigStaticTransform(config);
    }
    return config;
  });
}

module.exports = createWebpackConfigStatic;
