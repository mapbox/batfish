// @flow
'use strict';

const _ = require('lodash');
const constants = require('./constants');
const getEnvBrowserslist = require('./get-env-browserslist');

function createBabelConfig(
  batfishConfig: BatfishConfiguration,
  options: {
    target?: 'browser' | 'node'
  } = {}
): {
  presets: Array<*>,
  plugins: Array<*>
} {
  const target = options.target || constants.TARGET_BROWSER;

  let presetEnvOptions;

  if (target === constants.TARGET_NODE) {
    presetEnvOptions = {
      useBuiltIns: 'entry',
      targets: { node: 'current' },
      modules: false,
      corejs: 3
    };
  } else {
    const envBrowserslist = getEnvBrowserslist(
      batfishConfig.browserslist,
      batfishConfig.devBrowserslist,
      batfishConfig.production
    );
    presetEnvOptions = batfishConfig.babelPresetEnvOptions || {};
    if (presetEnvOptions.useBuiltIns === undefined) {
      presetEnvOptions.useBuiltIns = 'entry';
    }
    presetEnvOptions.modules = false;
    presetEnvOptions.corejs = 3;
    if (_.get(presetEnvOptions, ['targets', 'browsers']) === undefined) {
      _.set(presetEnvOptions, ['targets', 'browsers'], envBrowserslist);
    }
  }
  const presets = [
    [require.resolve('@babel/preset-env'), presetEnvOptions],
    require.resolve('@babel/preset-react')
  ].concat(batfishConfig.babelPresets);

  const plugins = [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    [
      require.resolve('@mapbox/babel-plugin-transform-jsxtreme-markdown'),
      {
        packageName: '@mapbox/batfish/modules/md',
        remarkPlugins: batfishConfig.jsxtremeMarkdownOptions.remarkPlugins,
        rehypePlugins: batfishConfig.jsxtremeMarkdownOptions.rehypePlugins
      }
    ]
  ].concat(batfishConfig.babelPlugins);

  if (batfishConfig.production) {
    plugins.push('babel-plugin-transform-react-remove-prop-types');
  } else {
    // plugins.push(require.resolve('babel-plugin-transform-react-jsx-source'));
    plugins.push(require.resolve('babel-plugin-transform-react-jsx-self'));
  }

  return { presets, plugins };
}

module.exports = createBabelConfig;
