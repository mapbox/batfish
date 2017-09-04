'use strict';

const del = require('del');
const pify = require('pify');
const path = require('path');
const mkdirp = require('mkdirp');
const tempy = require('tempy');
const writeDataModules = require('../src/node/write-data-modules');

describe('writeDataModules', () => {
  let tmp;

  const createAndReadDataModules = (batfishConfig, siteData) => {
    tmp = tempy.directory();
    batfishConfig.temporaryDirectory = tmp;
    return pify(mkdirp)(tmp)
      .then(() => writeDataModules(batfishConfig, siteData))
      .then(filePaths => {
        const result = new Map();
        filePaths.forEach(p => {
          result.set(path.relative(tmp, p), require(p));
        });
        return result;
      });
  };

  afterEach(() => {
    if (tmp) {
      return del(tmp, { force: true }).then(() => {
        tmp = null;
      });
    }
  });

  test('no data selectors', () => {
    return createAndReadDataModules({}).then(result => {
      expect(result.size).toBe(0);
    });
  });

  test('one data selector', () => {
    const siteData = {
      horseNames: ['jack', 'jill', 'biff']
    };
    return createAndReadDataModules(
      {
        dataSelectors: {
          namesOfHorses: siteData => siteData.horseNames.sort()
        }
      },
      siteData
    ).then(result => {
      expect(result.size).toBe(1);
      expect(result.get('data/names-of-horses.js')).toEqual([
        'biff',
        'jack',
        'jill'
      ]);
    });
  });

  test('three data selectors', () => {
    const siteData = {
      horseNames: ['jack', 'jill', 'biff'],
      pigNames: ['ed', 'ron']
    };
    return createAndReadDataModules(
      {
        dataSelectors: {
          namesOfHorses: siteData => siteData.horseNames.sort(),
          notFromSiteData: () => ({ one: 1, two: 2 }),
          allNames: siteData =>
            siteData.horseNames.concat(siteData.pigNames).sort()
        }
      },
      siteData
    ).then(result => {
      expect(result.size).toBe(3);
      expect(result.get('data/names-of-horses.js')).toEqual([
        'biff',
        'jack',
        'jill'
      ]);
      expect(result.get('data/not-from-site-data.js')).toEqual({
        one: 1,
        two: 2
      });
      expect(result.get('data/all-names.js')).toEqual([
        'biff',
        'ed',
        'jack',
        'jill',
        'ron'
      ]);
    });
  });
});
