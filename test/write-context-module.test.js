'use strict';

const _ = require('lodash');
const del = require('del');
const pify = require('pify');
const fs = require('fs');
const mkdirp = require('mkdirp');
const tempy = require('tempy');
const writeContextModule = require('../src/node/write-context-module');
const writePageModule = require('../src/node/write-page-module');
const writeDataModules = require('../src/node/write-data-modules');
const getPagesData = require('../src/node/get-pages-data');

jest.mock('../src/node/write-page-module', () => {
  return jest.fn((config, pageData) =>
    Promise.resolve(`module/file/path/for${pageData.filePath}`)
  );
});

jest.mock('../src/node/write-data-modules', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/get-pages-data', () => {
  return jest.fn();
});

describe('writeContextModule', () => {
  let tmp;

  const createAndReadContextModule = (batfishConfig = {}) => {
    tmp = tempy.directory();
    // _.defaults keeps the object reference the same so we can use that for
    // tests below.
    _.defaults(batfishConfig, {
      temporaryDirectory: tmp,
      pagesDirectory: 'fake/pages/directory',
      siteBasePath: '/fake/site/base/path',
      siteOrigin: 'https://www.fake-origin.com',
      hijackLinks: true,
    });
    return (
      mkdirp(tmp)
        .then(() => writeContextModule(batfishConfig))
        // We cannot import this file because it includes imports
        .then((filePath) => pify(fs.readFile)(filePath, 'utf8'))
    );
  };

  afterEach(() => {
    if (tmp) {
      return del(tmp, { force: true }).then(() => {
        tmp = null;
      });
    }
  });

  test('without 404', () => {
    const pagesData = {
      '/one/': {
        filePath: 'fake/pages/directory/one.js',
        path: '/one/',
        frontMatter: {},
      },
      '/two/': {
        filePath: 'fake/pages/directory/two/index.md',
        path: '/two/',
        frontMatter: {
          title: 'Page two',
          isGreat: true,
        },
      },
      '/three/four/': {
        filePath: 'fake/pages/directory/three/four/index.js',
        path: '/three/four/',
        frontMatter: {
          title: 'Another page',
          horseNames: ['gerald', 'rose'],
        },
      },
    };
    getPagesData.mockReturnValue(Promise.resolve(pagesData));

    const config = {};
    return createAndReadContextModule(config).then((result) => {
      expect(result).toMatchSnapshot();
      expect(writePageModule).toHaveBeenCalledTimes(3);
      expect(writePageModule).toHaveBeenCalledWith(config, {
        filePath: 'fake/pages/directory/one.js',
        path: '/one/',
        frontMatter: {},
      });
      expect(writePageModule).toHaveBeenCalledWith(config, {
        filePath: 'fake/pages/directory/two/index.md',
        path: '/two/',
        frontMatter: {
          title: 'Page two',
          isGreat: true,
        },
      });
      expect(writePageModule).toHaveBeenCalledWith(config, {
        filePath: 'fake/pages/directory/three/four/index.js',
        path: '/three/four/',
        frontMatter: {
          title: 'Another page',
          horseNames: ['gerald', 'rose'],
        },
      });
      expect(writeDataModules).toHaveBeenCalledTimes(1);
      expect(writeDataModules).toHaveBeenCalledWith(config, {
        pages: _.values(pagesData),
      });
    });
  });

  test('with 404 and some config variation', () => {
    getPagesData.mockReturnValue(
      Promise.resolve({
        '/one/': {
          filePath: 'fake/pages/directory/one.js',
          path: '/one/',
          frontMatter: {},
        },
        '/three/four/': {
          filePath: 'fake/pages/directory/three/four/index.js',
          path: '/three/four/',
          frontMatter: {
            title: 'Another page',
            horseNames: ['gerald', 'rose'],
          },
        },
        '/404/': {
          filePath: 'fake/pages/directory/404.js',
          path: '/404/',
          frontMatter: {},
          is404: true,
        },
      })
    );

    return createAndReadContextModule({
      siteBasePath: '/different/base/path',
      siteOrigin: '',
      hijackLinks: false,
    }).then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('includePages, set by --include flag, reduces routes included in config module', () => {
    beforeEach(() => {
      getPagesData.mockReturnValue(
        Promise.resolve({
          '/one/': {
            filePath: 'fake/pages/directory/one.js',
            path: '/one/',
            frontMatter: {},
          },
          '/two/': {
            filePath: 'fake/pages/directory/two.md',
            path: '/two/',
            frontMatter: {},
          },
          '/three/four/': {
            filePath: 'fake/pages/directory/three/four/index.js',
            path: '/three/four/',
            frontMatter: {
              title: 'Another page',
              horseNames: ['gerald', 'rose'],
            },
          },
          '/three/four/five/': {
            filePath: 'fake/pages/directory/three/four/five.js',
            path: '/three/four/five/',
            frontMatter: {},
          },
          '/404/': {
            filePath: 'fake/pages/directory/404.js',
            path: '/404/',
            frontMatter: {},
          },
        })
      );
    });

    test('with a whitelisted directory', () => {
      return createAndReadContextModule({
        includePages: ['/three/**'],
      }).then((result) => {
        expect(result).toMatch("path: '/three/four/'");
        expect(result).toMatch("path: '/three/four/five/'");
        expect(result).not.toMatch("path: '/one/'");
        expect(result).not.toMatch("path: '/two/'");
        expect(result).not.toMatch("path: '/404/'");
      });
    });

    test('with a whitelisted file', () => {
      return createAndReadContextModule({
        includePages: ['/two/'],
      }).then((result) => {
        expect(result).toMatch("path: '/two/'");
        expect(result).not.toMatch("path: '/three/four/'");
        expect(result).not.toMatch("path: '/three/four/five/'");
        expect(result).not.toMatch("path: '/one/'");
        expect(result).not.toMatch("path: '/404/'");
      });
    });
  });
});
