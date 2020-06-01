'use strict';

const _ = require('lodash');
const path = require('path');
const createWebpackConfigBase = require('../src/node/create-webpack-config-base');
const createBabelConfig = require('../src/node/create-babel-config');
const writeContextModule = require('../src/node/write-context-module');
const validateConfig = require('../src/node/validate-config');
const projectRootSerializer = require('./test-util/project-root-serializer');

jest.mock('../src/node/write-context-module', () => {
  return jest.fn(() => Promise.resolve('fake/batfish-context.js'));
});

jest.mock('../src/node/create-babel-config', () => {
  return jest.fn(() => ({
    presets: 'mock-babel-presets',
    plugins: 'mock-babe-plugins'
  }));
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

describe('createWebpackConfigBase', () => {
  afterEach(() => {
    createWebpackConfigBase._clearCache();
  });

  test('default Webpack config', () => {
    return createWebpackConfigBase(createBatfishConfig()).then(
      (webpackConfig) => {
        expect(webpackConfig).toMatchSnapshot();
      }
    );
  });

  test('default production Webpack config', () => {
    return createWebpackConfigBase(
      createBatfishConfig({ production: true })
    ).then((webpackConfig) => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });

  test('writes a context module and adds it to the config', () => {
    const batfishConfig = createBatfishConfig();
    return createWebpackConfigBase(batfishConfig).then((webpackConfig) => {
      expect(writeContextModule).toHaveBeenCalledTimes(1);
      expect(writeContextModule).toHaveBeenCalledWith(batfishConfig);
      expect(
        _.get(webpackConfig, ['resolve', 'alias', 'batfish-internal/context'])
      ).toBe('fake/batfish-context.js');
    });
  });

  test('changes Babel config for targeting node', () => {
    const batfishConfig = createBatfishConfig();
    return createWebpackConfigBase(batfishConfig, { target: 'node' }).then(
      () => {
        expect(createBabelConfig).toHaveBeenCalledWith(batfishConfig, {
          target: 'node'
        });
      }
    );
  });

  test('with all Batfish config options that make a difference', () => {
    const batfishConfig = createBatfishConfig({
      jsxtremeMarkdownOptions: {
        prependJs: [
          `const add = (x, y) => x + y;`,
          `import egg from 'chicken';`
        ],
        remarkPlugins: [
          function remarkPluginOne() {},
          function remarkPluginTwo() {}
        ]
      },
      babelPresets: [
        function babelPresetOne() {},
        function babelPresetTwo() {}
      ],
      babelPlugins: [
        function babelPluginOne() {},
        function babelPluginTwo() {}
      ],
      fileLoaderExtensions: ['txt', 'config'],
      siteBasePath: '/site/base/path/',
      verbose: true,
      babelExclude: /node_modules\/nothing/,
      babelInclude: ['p-queue', { include: '/foo', exclude: '/foo/bar' }],
      webpackLoaders: [
        {
          test: /\.jpg$/,
          use: 'jpg-loader'
        },
        {
          test: /\.png$/,
          use: 'png-loader'
        }
      ],
      applicationWrapperPath: path.join(
        __dirname,
        './fixtures/empty-component.js'
      ),
      temporaryDirectory: path.join(__dirname, './fake/temporary/directory')
    });
    return createWebpackConfigBase(batfishConfig).then((webpackConfig) => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });
});
