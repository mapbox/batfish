'use strict';

const del = require('del');
const pify = require('pify');
const path = require('path');
const mkdirp = require('mkdirp');
const tempy = require('tempy');
const writePageModule = require('../src-node/write-page-module');

describe('writePageModule', () => {
  const tmp = tempy.directory();
  const pageComponentPath = path.join(
    __dirname,
    './fixtures/write-page-module/page-component-module.js'
  );

  const createAndReadPageModule = (batfishConfig, pageData) => {
    return pify(mkdirp)(tmp)
      .then(() => {
        return writePageModule(batfishConfig, pageData);
      })
      .then(filePath => {
        // Because this uses require, we need to avoid the require cache by
        // creating files with different names for each test.
        return require(filePath);
      });
  };

  afterEach(() => {
    return del(tmp, { force: true });
  });

  test('home without any front matter', () => {
    return createAndReadPageModule(
      {
        temporaryDirectory: '/tmp'
      },
      {
        path: '/',
        filePath: pageComponentPath
      }
    ).then(result => {
      expect(result).toEqual({
        component: {
          // Export of page-component-module.js
          pageComponent: true
        },
        props: {}
      });
    });
  });

  test('non-home with front matter', () => {
    return createAndReadPageModule(
      {
        temporaryDirectory: '/tmp'
      },
      {
        path: '/foo',
        filePath: pageComponentPath,
        frontMatter: {
          title: 'Pigman'
        }
      }
    ).then(result => {
      expect(result).toEqual({
        component: {
          // Export of page-component-module.js
          pageComponent: true
        },
        props: {
          frontMatter: {
            title: 'Pigman'
          }
        }
      });
    });
  });
});
