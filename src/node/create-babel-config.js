// @flow
'use strict';

const constants = require('./constants');

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

  const presetEnvOptions =
    target === constants.TARGET_NODE
      ? { useBuiltIns: true, targets: { node: 'current' } }
      : batfishConfig.babelPresetEnvOptions || {};

  const presets = [
    [require.resolve('babel-preset-env'), presetEnvOptions],
    require.resolve('babel-preset-react')
  ].concat(batfishConfig.babelPresets);

  const plugins = [
    require.resolve('babel-plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-transform-class-properties'),
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
    plugins.push(require.resolve('babel-plugin-transform-react-jsx-source'));
    plugins.push(require.resolve('babel-plugin-transform-react-jsx-self'));
  }

  return { presets, plugins };
}

module.exports = createBabelConfig;
