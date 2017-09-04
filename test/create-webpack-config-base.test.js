'use strict';

const _ = require('lodash');
const path = require('path');
const createWebpackConfigBase = require('../src/node/create-webpack-config-base');
const writeContextModule = require('../src/node/write-context-module');
const validateConfig = require('../src/node/validate-config');
const projectRootSerializer = require('./test-util/project-root-serializer');

jest.mock('../src/node/write-context-module', () => {
  return jest.fn(() => Promise.resolve('fake/batfish-context.js'));
});

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
    return createWebpackConfigBase(
      createBatfishConfig()
    ).then(webpackConfig => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });

  test('default production Webpack config', () => {
    return createWebpackConfigBase(
      createBatfishConfig({ production: true })
    ).then(webpackConfig => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });

  test('writes a context module and adds it to the config', () => {
    const batfishConfig = createBatfishConfig();
    return createWebpackConfigBase(batfishConfig).then(webpackConfig => {
      expect(writeContextModule).toHaveBeenCalledTimes(1);
      expect(writeContextModule).toHaveBeenCalledWith(batfishConfig);
      expect(
        _.get(webpackConfig, ['resolve', 'alias', 'batfish-internal/context'])
      ).toBe('fake/batfish-context.js');
    });
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
      fileLoaderExtensions: ['.txt', '.config'],
      siteBasePath: '/site/base/path/',
      verbose: true,
      babelExclude: /node_modules\/nothing/,
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
      temporaryDirectory: path.join(__dirname, './fake/tempoerary/directory')
    });
    return createWebpackConfigBase(batfishConfig).then(webpackConfig => {
      expect(webpackConfig).toMatchSnapshot();
    });
  });
});
