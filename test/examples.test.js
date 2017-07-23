'use strict';

const _ = require('lodash');
const pify = require('pify');
const fs = require('fs');
const path = require('path');
const pathType = require('path-type');

const examplesDirectory = path.join(__dirname, '../examples');

describe('examples', () => {
  let exampleNames;

  beforeAll(() => {
    return pify(fs.readdir)(examplesDirectory).then(items => {
      const subDirectories = [];
      return Promise.all(
        items.map(item => {
          return pathType
            .dir(path.join(examplesDirectory, item))
            .then(isDir => {
              if (isDir) subDirectories.push(item);
            });
        })
      ).then(() => {
        exampleNames = subDirectories;
      });
    });
  });

  test('every example contains a README', () => {
    return Promise.all(
      exampleNames.map(example => {
        const readmeFilename = path.join(
          examplesDirectory,
          example,
          'README.md'
        );
        return pify(fs.readFile)(readmeFilename, 'utf8').catch(() => {
          throw new Error(`Could not find README for example "${example}"`);
        });
      })
    );
  });

  test('every example contains a package.json that fits conventions', () => {
    return Promise.all(
      exampleNames.map(example => {
        const packageJsonFilename = path.join(
          examplesDirectory,
          example,
          'package.json'
        );
        return pify(fs.readFile)(packageJsonFilename, 'utf8').then(
          contents => {
            const pkg = JSON.parse(contents);
            if (pkg.private !== true) {
              throw new Error(
                `Bad example "${example}": missing { "private": true } in package.json`
              );
            }
            if (
              _.get(pkg, 'scripts.batfish', '').indexOf(
                '../../bin/batfish.js'
              ) === -1
            ) {
              throw new Error(
                `Bad example "${example}": missing { "scripts": { "batfish": "../../bin/batfish.js" } } in package.json`
              );
            }
          },
          () => {
            throw new Error(
              `Bad example "${example}": could not find package.json`
            );
          }
        );
      })
    );
  });
});
