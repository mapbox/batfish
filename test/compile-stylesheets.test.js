'use strict';

const got = require('got');
const fs = require('fs');
const pify = require('pify');
const path = require('path');
const del = require('del');
const tempy = require('tempy');
const compileStylesheets = require('../src/node/compile-stylesheets');

jest.mock('got', () => {
  return jest.fn();
});

describe('compileStylesheets', () => {
  let tmp;
  let batfishConfig;

  beforeEach(() => {
    tmp = tempy.directory();
    // This url() reference should be transformed into an absolute URL.
    const mockUrlCss = `
      @font-face {
        font-family: 'mock-style';
        src: url('assets/mock-style.woff') format('woff2');
      }
      .mock-style { color: brown; }
    `;
    got.mockImplementation((arg) => {
      if (arg === 'https://www.mapbox.com/mock-style.css') {
        return Promise.resolve({
          body: mockUrlCss,
        });
      }
      return Promise.reject(new Error('Unexpected URL.'));
    });

    batfishConfig = {
      outputDirectory: tmp,
      publicAssetsPath: 'assets',
      // Test URLs, globs, and absolute filenames.
      stylesheets: [
        'https://www.mapbox.com/mock-style.css',
        path.join(__dirname, './fixtures/stylesheets/*.css'),
        [
          path.join(__dirname, './fixtures/stylesheets/inner/*.css'),
          '!**/d.css',
        ],
        path.join(__dirname, './fixtures/stylesheets/inner/innermost/e.css'),
      ],
      siteBasePath: '/mock/base/path',
    };
  });

  afterEach(() => {
    return del(tmp, {
      force: true,
    });
  });

  test('writes expected CSS file', () => {
    return compileStylesheets(batfishConfig)
      .then((cssFilePath) => pify(fs.readFile)(cssFilePath, 'utf8'))
      .then((css) => {
        expect(css).toMatchSnapshot();
      });
  });

  test('creates a source map', () => {
    return compileStylesheets(batfishConfig).then((cssFilePath) => {
      expect(fs.existsSync(cssFilePath + '.map')).toBe(true);
    });
  });

  test('copies url-referenced assets', () => {
    return compileStylesheets(batfishConfig).then(() => {
      expect(fs.readdirSync(tmp)).toEqual([
        // Hashes of these woff2 files are based on the text content, so
        // should stay constant between tests.
        'a_994d9585.woff2',
        'batfish-styles.css',
        'batfish-styles.css.map',
        'c_675d172a.woff2',
        'e_24153b0b.woff2',
      ]);
    });
  });

  test('minimizes in production', () => {
    return compileStylesheets(
      Object.assign({}, batfishConfig, {
        production: true,
      })
    )
      .then((cssFilePath) => {
        // [a-f0-9]{32} matches md5 hash.
        expect(path.basename(cssFilePath)).toMatch(
          /batfish-styles-[a-f0-9]{32}\.css$/
        );
        return pify(fs.readFile)(cssFilePath, 'utf8');
      })
      .then((css) => {
        expect(css).toMatchSnapshot();
      });
  });
});
