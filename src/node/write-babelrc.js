// @flow
'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const validateConfig = require('./validate-config');
const createBabelConfig = require('./create-babel-config');
const constants = require('./constants');
const errorTypes = require('./error-types');

function writeBabelrc(
  rawConfig?: Object,
  options: {
    projectDirectory?: string,
    target?: 'browser' | 'node',
    outputDirectory?: string
  } = {}
): string {
  const target = options.target || constants.TARGET_NODE;
  const outputDirectory =
    options.outputDirectory || options.projectDirectory || process.cwd();
  const filepath = path.join(outputDirectory, '.babelrc');
  const batfishConfig = validateConfig(
    Object.assign({ production: false }, rawConfig),
    options.projectDirectory
  );
  const rawBabelConfig = createBabelConfig(batfishConfig, { target });

  if (
    !batfishConfig.babelPlugins.every(_.isString) ||
    !batfishConfig.babelPresets.every(_.isString)
  ) {
    throw new errorTypes.ConfigFatalError(
      'To write a .babelrc file you must use absolute paths for the babelPlugins and babelPresets in your Batfish config'
    );
  }

  const relativizeBabelSetting = (
    p: string | [string, ?Object]
  ): string | [string, ?Object] => {
    if (!Array.isArray(p)) {
      return `./${path.relative(outputDirectory, p)}`;
    }
    return [`./${path.relative(outputDirectory, p[0])}`, p[1]];
  };

  const relativizedBabelConfig = {
    presets: rawBabelConfig.presets.map(relativizeBabelSetting),
    plugins: rawBabelConfig.plugins.map(relativizeBabelSetting)
  };

  mkdirp.sync(outputDirectory);
  fs.writeFileSync(filepath, JSON.stringify(relativizedBabelConfig, null, 2));
  return filepath;
}

module.exports = writeBabelrc;
