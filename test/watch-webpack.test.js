'use strict';

const webpack = require('webpack');
const watchWebpack = require('../src/node/watch-webpack');
const createWebpackConfigClient = require('../src/node/create-webpack-config-client');
const errorTypes = require('../src/node/error-types');
const watchContext = require('../src/node/watch-context');

jest.mock('webpack', () => {
  const compiler = {
    watch: jest.fn(),
  };
  const mockWebpack = jest.fn(() => compiler);
  mockWebpack.compiler = compiler;
  return mockWebpack;
});

jest.mock('../src/node/create-webpack-config-client', () => {
  return jest.fn(() => Promise.resolve({ mockClientClient: true }));
});

jest.mock('../src/node/watch-context', () => {
  return jest.fn();
});

jest.mock('../src/node/write-webpack-stats', () => {
  return jest.fn(() => Promise.resolve());
});

function createMockStats(hash) {
  return {
    hash,
    toJson: jest.fn(() => 'stats-to-json'),
    hasErrors: jest.fn(() => false),
  };
}

describe('watchWebpack', () => {
  let batfishConfig;
  let onError;
  let onNotification;
  let onFirstCompile;

  beforeEach(() => {
    onError = jest.fn();
    onNotification = jest.fn();
    onFirstCompile = jest.fn();
    batfishConfig = {
      outputDirectory: '/mock/output/directory/',
      pagesDirectory: '/mock/pages/directory/',
      temporaryDirectory: '/mock/temporary/directory/',
      stylesheets: ['one.css', 'two.css'],
      verbose: false,
    };
  });

  test('creates a webpack client config', () => {
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    expect(createWebpackConfigClient).toHaveBeenCalledWith(batfishConfig, {
      devServer: true,
    });
  });

  test('handles webpack configuration errors', (done) => {
    const webpackError = new Error();
    webpack.mockImplementationOnce(() => {
      throw webpackError;
    });
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    expect.hasAssertions();
    process.nextTick(() => {
      expect(onError).toHaveBeenCalled();
      const error = onError.mock.calls[0][0];
      expect(error).toBeInstanceOf(errorTypes.WebpackFatalError);
      expect(error.originalError).toBe(webpackError);
      done();
    });
  });

  test("starts webpack's watch", (done) => {
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    process.nextTick(() => {
      expect(webpack.compiler.watch).toHaveBeenCalledTimes(1);
      expect(webpack.compiler.watch.mock.calls[0][0]).toEqual({
        ignored: [/node_modules/, '/mock/temporary/directory/**/*'],
      });
      expect(webpack.compiler.watch.mock.calls[0][1]).toBeInstanceOf(Function);
      done();
    });
  });

  test('starts the context watcher', (done) => {
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    process.nextTick(() => {
      expect(watchContext).toHaveBeenCalledTimes(1);
      expect(watchContext.mock.calls[0][0]).toBe(batfishConfig);
      expect(watchContext.mock.calls[0][1]).toHaveProperty('onError');
      expect(watchContext.mock.calls[0][1]).toHaveProperty('afterCompilation');
      done();
    });
  });

  test('catches errors from context watcher', (done) => {
    const expectedError = new Error();
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    expect.hasAssertions();
    process.nextTick(() => {
      watchContext.mock.calls[0][1].onError(expectedError);
      expect(onError).toHaveBeenLastCalledWith(expectedError);
      done();
    });
  });

  test('on first compilation calls callbak', (done) => {
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    expect.hasAssertions();
    process.nextTick(() => {
      // Invoke the watcher callback twice.
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      expect(onFirstCompile).toHaveBeenCalledTimes(1);
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('b'));
      done();
    });
  });

  test('handles fatal errors', (done) => {
    const expectedError = new Error();
    watchWebpack(batfishConfig, { onError, onNotification, onFirstCompile });
    expect.hasAssertions();
    process.nextTick(() => {
      // Invoke the watcher callback with an error.
      webpack.compiler.watch.mock.calls[0][1](
        expectedError,
        createMockStats('a')
      );
      expect(onError).toHaveBeenCalled();
      const error = onError.mock.calls[0][0];
      expect(error).toBeInstanceOf(errorTypes.WebpackCompilationError);
      expect(error.originalError).toBe(expectedError);
      done();
    });
  });
});
