'use strict';

const fs = require('fs');
const path = require('path');
const UglifyJs = require('uglify-js');
const renderHtml = require('../src/node/render-html');
const errorTypes = require('../src/node/error-types');

const MOCK_ASSETS_DIRECTORY = '/mock/output/assets';
const MOCK_MANIFEST_JS_PATH = 'mock-asset-manifest-js-path';
const MOCK_MANIFEST_JS = 'mock-asset-manifest-js-content';

jest.mock('uglify-js', () => {
  return {
    minify: jest.fn(() => ({
      code: 'minified-js',
      error: null
    }))
  };
});

jest.mock('../src/node/get-webpack-asset-absolute-path', () => {
  return jest.fn(() => 'mock-asset-manifest-js-path');
});

jest.mock(
  '/mock/output/assets/static-render-pages.js',
  () => {
    return {
      default: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);

describe('renderHtml', () => {
  let batfishConfig;

  beforeEach(() => {
    batfishConfig = {
      outputDirectory: '/mock/output',
      siteBasePath: '/base',
      stylesheets: ['one.css', 'two.css']
    };
    jest.spyOn(fs, 'readFileSync').mockImplementation(filename => {
      if (filename === path.join(MOCK_ASSETS_DIRECTORY, 'assets.json')) {
        return JSON.stringify({
          manifest: { js: 'mock-manifest.js' },
          app: { js: 'mock-app.js' },
          vendor: { js: 'mock-app.js' }
        });
      } else if (filename === MOCK_MANIFEST_JS_PATH) {
        return MOCK_MANIFEST_JS;
      }
    });
  });

  afterEach(() => {
    fs.readFileSync.mockRestore();
  });

  test('reads assets.json', () => {
    return renderHtml(batfishConfig, 'mock-stylesheet.css').then(() => {
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.join(MOCK_ASSETS_DIRECTORY, 'assets.json'),
        'utf8'
      );
    });
  });

  test('reads manifest', () => {
    return renderHtml(batfishConfig, 'mock-stylesheet.css').then(() => {
      expect(fs.readFileSync).toHaveBeenCalledWith(
        MOCK_MANIFEST_JS_PATH,
        'utf8'
      );
    });
  });

  test('uglifies manifest', () => {
    return renderHtml(batfishConfig, 'mock-stylesheet.css').then(() => {
      expect(UglifyJs.minify).toHaveBeenCalledWith(MOCK_MANIFEST_JS);
    });
  });

  test('runs the compiled static-render-pages.js', () => {
    // eslint-disable-next-line node/no-missing-require
    const mockStaticRenderPages = require('/mock/output/assets/static-render-pages.js')
      .default;
    return renderHtml(batfishConfig, 'mock-stylesheet.css').then(() => {
      expect(mockStaticRenderPages).toHaveBeenCalledTimes(1);
      expect(mockStaticRenderPages).toHaveBeenCalledWith(
        batfishConfig,
        {
          manifest: { js: 'mock-manifest.js' },
          app: { js: 'mock-app.js' },
          vendor: { js: 'mock-app.js' }
        },
        'minified-js',
        '/base/assets/mock-stylesheet.css'
      );
    });
  });

  test('handles errors when reading assets.json', () => {
    const expectedError = new Error();
    fs.readFileSync.mockImplementation(filename => {
      if (filename === path.join(MOCK_ASSETS_DIRECTORY, 'assets.json')) {
        throw expectedError;
      } else {
        return '';
      }
    });
    expect(renderHtml(batfishConfig)).rejects.toBe(expectedError);
  });

  test('handles errors when reading man', () => {
    const expectedError = new Error();
    fs.readFileSync.mockImplementation(filename => {
      if (filename === path.join(MOCK_ASSETS_DIRECTORY, 'assets.json')) {
        return JSON.stringify({ manifest: { js: 'mock-manifest.js' } });
      } else if (filename === MOCK_MANIFEST_JS_PATH) {
        throw expectedError;
      }
    });
    expect(renderHtml(batfishConfig)).rejects.toBe(expectedError);
  });

  test('if there are no stylesheets, no cssUrl argument is passed to staticRenderPages', () => {
    // eslint-disable-next-line node/no-missing-require
    const mockStaticRenderPages = require('/mock/output/assets/static-render-pages.js')
      .default;
    batfishConfig.stylesheets = [];
    return renderHtml(batfishConfig).then(() => {
      expect(mockStaticRenderPages.mock.calls[0][3]).toBeUndefined();
    });
  });

  test('catches errors parsing compiled static-render-pages.js', () => {
    const expectedError = new Error();
    // eslint-disable-next-line node/no-missing-require
    const mockStaticRenderPages = require('/mock/output/assets/static-render-pages.js')
      .default;
    mockStaticRenderPages.mockImplementation(() => {
      throw expectedError;
    });
    return renderHtml(batfishConfig).then(
      () => {
        throw new Error('should have errored');
      },
      error => {
        expect(error).toBeInstanceOf(errorTypes.WebpackNodeParseError);
        expect(error.originalError).toBe(expectedError);
      }
    );
  });

  test('catches errors executing compiled static-render-pages.js', () => {
    const expectedError = new Error();
    // eslint-disable-next-line node/no-missing-require
    const mockStaticRenderPages = require('/mock/output/assets/static-render-pages.js')
      .default;
    mockStaticRenderPages.mockImplementation(() =>
      Promise.reject(expectedError)
    );
    return renderHtml(batfishConfig).then(
      () => {
        throw new Error('should have errored');
      },
      error => {
        expect(error).toBeInstanceOf(errorTypes.WebpackNodeExecutionError);
        expect(error.originalError).toBe(expectedError);
      }
    );
  });
});
