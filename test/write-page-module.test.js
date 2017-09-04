'use strict';

const del = require('del');
const pify = require('pify');
const path = require('path');
const mkdirp = require('mkdirp');
const tempy = require('tempy');
const writePageModule = require('../src/node/write-page-module');

describe('writePageModule', () => {
  let tmp;
  const pageComponentPath = path.join(
    __dirname,
    './fixtures/write-page-module/page-component-module.js'
  );

  const createAndReadPageModule = (batfishConfig, pageData) => {
    tmp = tempy.directory();
    return pify(mkdirp)(tmp)
      .then(() => writePageModule(batfishConfig, pageData))
      .then(filePath => require(filePath));
  };

  afterEach(() => {
    if (tmp) {
      return del(tmp, { force: true }).then(() => {
        tmp = null;
      });
    }
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
