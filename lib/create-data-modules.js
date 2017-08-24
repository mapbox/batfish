'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const pTry = require('p-try');
const prettier = require('prettier');
const constants = require('./constants');
const errorTypes = require('./error-types');

/**
 * Write the return value of each data selector to a module in the data
 * subdirectory of the temporary directory. This directory is aliased by Webpack
 * so these modules can be imported from `@mapbox/batfish/data/*`.
 *
 * @param {BatfishConfig} batfishConfig
 * @param {object} siteData
 * @return {Promise<Array<string>>} - Resolves with an array of filenames for
 *   the data modules that were written.
 */
function createDataModules(batfishConfig, siteData) {
  return pTry(() => {
    const dataOutputDirectory = path.join(
      batfishConfig.temporaryDirectory,
      constants.DATA_DIRECTORY
    );

    const createSingleDataModule = (dataSelector, id) => {
      const data = dataSelector(siteData);

      let dataString;
      try {
        dataString = JSON.stringify(data);
      } catch (jsonParseError) {
        throw new errorTypes.ConfigFatalError(
          `Could not parse return value of data selector ${chalk.yellow(
            id
          )} as JSON. Data selectors must return JSON.`
        );
      }

      const code = `module.exports = ${dataString};`;
      const prettyCode = prettier.format(code);
      const filename = path.join(dataOutputDirectory, `${_.kebabCase(id)}.js`);
      return pify(fs.writeFile)(filename, prettyCode).then(() => filename);
    };

    if (!batfishConfig.dataSelectors) {
      return [];
    }
    return pify(mkdirp)(dataOutputDirectory).then(() => {
      return Promise.all(
        _.map(batfishConfig.dataSelectors, createSingleDataModule)
      );
    });
  });
}

module.exports = createDataModules;
