'use strict';

const path = require('path');
const createWebpackConfigClient = require('../src/node/create-webpack-config-client');
const createWebpackConfigBase = require('../src/node/create-webpack-config-base');
const validateConfig = require('../src/node/validate-config');
const projectRootSerializer = require('./test-util/project-root-serializer');

jest.mock('../src/node/create-webpack-config-base', () => {
  return jest.fn(() => Promise.resolve({ createdWebpackConfigBase: true }));
});

jest.mock('path-type', () => {
  return {
    isDirectorySync: jest.fn(() => true),
    isFileSync: jest.fn(() => true),
  };
});

expect.addSnapshotSerializer(projectRootSerializer);

function createBatfishConfig(options) {
  return validateConfig(
    Object.assign(
      {
        pagesDirectory: path.join(__dirname, './fixtures/get-pages-data'),
      },
      options
    )
  );
}

describe('createWebpackConfigClient', () => {
  test('creates a base config', () => {
    const batfishConfig = createBatfishConfig();
    return createWebpackConfigClient(batfishConfig).then((webpackConfig) => {
      expect(createWebpackConfigBase).toHaveBeenCalledTimes(1);
      expect(createWebpackConfigBase).toHaveBeenCalledWith(batfishConfig, {
        target: 'browser',
      });
      expect(webpackConfig.createdWebpackConfigBase).toBe(true);
    });
  });

  test('default Webpack config', () => {
    return createWebpackConfigClient(createBatfishConfig()).then(
      (webpackConfig) => {
        expect(webpackConfig).toMatchSnapshot();
      }
    );
  });

  test('default production Webpack config', () => {
    return createWebpackConfigClient(
      createBatfishConfig({ production: true })
    ).then((webpackConfig) => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });

  test('with all Batfish config options that make a difference', () => {
    const batfishConfig = createBatfishConfig({
      includePromisePolyfill: false,
      vendorModules: ['pigman', 'revenge-of-pigman'],
      outputDirectory: path.join(__dirname, './fake/output/directory'),
      inlineJs: [
        { filename: path.join(__dirname, './sea-creatures.js') },
        { filename: path.join(__dirname, './land-creatures.js') },
      ],
      webpackConfigClientTransform: (x) => {
        x.underwentClientTransform = true;
        return x;
      },
    });
    return createWebpackConfigClient(batfishConfig).then((webpackConfig) => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });
});
