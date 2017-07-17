'use strict';

const del = require('del');
const pify = require('pify');
const path = require('path');
const mkdirp = require('mkdirp');
const createPageModule = require('../lib/create-page-module');

describe('createPageModule', () => {
  // Replace with tempy
  const tmp = path.join(__dirname, '../test-tmp');

  const createAndReadPageModule = options => {
    return pify(mkdirp)(tmp)
      .then(() => {
        return createPageModule(options);
      })
      .then(filePath => {
        // Because this uses require, we need to avoid the require cache by
        // creating files with different names for each test.
        return require(filePath);
      });
  };

  afterEach(() => {
    return del(path.join(tmp, '*.*'), { force: true });
  });

  test('home without any front matter or site data', () => {
    const options = {
      pageData: {
        path: '/',
        filePath: path.join(
          __dirname,
          './fixtures/create-page-module/page-component-module.js'
        )
      },
      batfishConfig: {
        temporaryDirectory: '/tmp'
      }
    };

    return createAndReadPageModule(options).then(result => {
      expect(result).toEqual({
        component: {
          // Export of page-component-module.js
          pageComponent: true
        },
        props: {
          frontMatter: {}
        }
      });
    });
  });

  test('non-home with front matter and site data references', () => {
    const options = {
      pageData: {
        path: '/foo',
        filePath: path.join(
          __dirname,
          './fixtures/create-page-module/page-component-module.js'
        ),
        frontMatter: {
          title: 'Pigman',
          siteData: ['fizz', 'plop']
        }
      },
      siteData: {
        fizz: 77,
        plop: 44
      },
      batfishConfig: {
        temporaryDirectory: '/tmp'
      }
    };

    return createAndReadPageModule(options).then(result => {
      expect(result).toEqual({
        component: {
          // Export of page-component-module.js
          pageComponent: true
        },
        props: {
          frontMatter: {
            title: 'Pigman'
          },
          siteData: {
            fizz: 77,
            plop: 44
          }
        }
      });
    });
  });

  test('dataSelectors', () => {
    const options = {
      pageData: {
        path: '/foop',
        filePath: path.join(
          __dirname,
          './fixtures/create-page-module/page-component-module.js'
        ),
        frontMatter: {
          siteData: ['fizz', 'plop']
        }
      },
      siteData: {},
      batfishConfig: {
        temporaryDirectory: '/tmp',
        dataSelectors: {
          fizz: jest.fn(() => 33),
          plop: jest.fn(() => 99)
        }
      }
    };

    return createAndReadPageModule(options).then(result => {
      expect(result).toEqual({
        component: {
          // Export of page-component-module.js
          pageComponent: true
        },
        props: {
          frontMatter: {},
          siteData: {
            fizz: 33,
            plop: 99
          }
        }
      });
      expect(options.batfishConfig.dataSelectors.fizz).toHaveBeenCalledTimes(1);
      expect(options.batfishConfig.dataSelectors.fizz).toHaveBeenCalledWith(
        options.siteData
      );
      expect(options.batfishConfig.dataSelectors.plop).toHaveBeenCalledTimes(1);
      expect(options.batfishConfig.dataSelectors.plop).toHaveBeenCalledWith(
        options.siteData
      );
    });
  });

  test('error on non-existent data identifier', () => {
    const options = {
      pageData: {
        path: '/foop',
        filePath: path.join(
          __dirname,
          './fixtures/create-page-module/page-component-module.js'
        ),
        frontMatter: {
          siteData: ['flip']
        }
      },
      siteData: {},
      batfishConfig: {
        temporaryDirectory: '/tmp',
        siteData: {
          foo: 33
        },
        dataSelectors: {
          fizz: jest.fn(() => 33),
          plop: jest.fn(() => 99)
        }
      }
    };

    return createAndReadPageModule(options).then(
      () => {
        throw new Error('should have errored');
      },
      error => {
        expect(error.message).toBe(
          'There is no data or data selector named "flip"'
        );
      }
    );
  });
});
