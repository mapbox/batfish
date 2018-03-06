'use strict';

const path = require('path');
const createWebpackConfigStatic = require('../src/node/create-webpack-config-static');
const createWebpackConfigBase = require('../src/node/create-webpack-config-base');
const validateConfig = require('../src/node/validate-config');
const projectRootSerializer = require('./test-util/project-root-serializer');

jest.mock('../src/node/create-webpack-config-base', () => {
  return jest.fn(() => Promise.resolve({ createdWebpackConfigBase: true }));
});

// Mock mkdirp so validateConfig does not create a temporary directory.
jest.mock('mkdirp', () => ({ sync: jest.fn() }));

expect.addSnapshotSerializer(projectRootSerializer);

function createBatfishConfig(options) {
  return validateConfig(
    Object.assign(
      {
        pagesDirectory: path.join(__dirname, './fixtures/get-pages-data')
      },
      options
    )
  );
}

describe('createWebpackConfigStatic', () => {
  test('creates a base config', () => {
    const batfishConfig = createBatfishConfig();
    return createWebpackConfigStatic(batfishConfig).then(webpackConfig => {
      expect(createWebpackConfigBase).toHaveBeenCalledTimes(1);
      expect(createWebpackConfigBase).toHaveBeenCalledWith(batfishConfig, {
        target: 'node'
      });
      expect(webpackConfig.createdWebpackConfigBase).toBe(true);
    });
  });

  test('default Webpack config', () => {
    return createWebpackConfigStatic(createBatfishConfig()).then(
      webpackConfig => {
        expect(webpackConfig).toMatchSnapshot();
      }
    );
  });

  test('with all Batfish config options that make a difference', () => {
    const batfishConfig = createBatfishConfig({
      webpackStaticIgnore: /stuff\/to\/ignore/,
      webpackConfigStaticTransform: x => {
        x.underwentStaticTransform = true;
        return x;
      }
    });
    return createWebpackConfigStatic(batfishConfig).then(webpackConfig => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });
});
