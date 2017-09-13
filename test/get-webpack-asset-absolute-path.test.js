'use strict';

const getWebpackAssetAbsolutePath = require('../src/node/get-webpack-asset-absolute-path');

describe('getWebpackAssetAbsolutePath', () => {
  test('strips siteBasePath from start and joins path to outputDirectory', () => {
    expect(
      getWebpackAssetAbsolutePath(
        { siteBasePath: '/foo', outputDirectory: '/output/directory' },
        '/foo/assets/foo/baz.js'
      )
    ).toBe('/output/directory/assets/foo/baz.js');
  });

  test('works if there is no siteBasePath', () => {
    expect(
      getWebpackAssetAbsolutePath(
        { outputDirectory: '/output/directory' },
        '/foo/assets/foo/baz.js'
      )
    ).toBe('/output/directory/foo/assets/foo/baz.js');
  });
});
