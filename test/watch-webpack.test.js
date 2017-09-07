'use strict';

const webpack = require('webpack');
const stripAnsi = require('strip-ansi');
const watchWebpack = require('../src/node/watch-webpack');
const createWebpackConfigClient = require('../src/node/create-webpack-config-client');
const errorTypes = require('../src/node/error-types');
const watchContext = require('../src/node/watch-context');
const writeWebpackStats = require('../src/node/write-webpack-stats');

jest.mock('webpack', () => {
  const compiler = {
    watch: jest.fn()
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

jest.mock('../src/node/server-init-message', () => {
  return jest.fn(() => 'server initialization message');
});

jest.mock('../src/node/write-webpack-stats', () => {
  return jest.fn(() => Promise.resolve());
});

function createMockStats(hash) {
  return {
    hash,
    toJson: jest.fn(() => 'stats-to-json'),
    hasErrors: jest.fn(() => false)
  };
}

describe('watchWebpack', () => {
  let batfishConfig;
  let server;

  beforeEach(() => {
    batfishConfig = {
      outputDirectory: '/mock/output/directory/',
      pagesDirectory: '/mock/pages/directory/',
      stylesheets: ['one.css', 'two.css'],
      verbose: false
    };
    server = {
      browserSyncInstance: {},
      reload: jest.fn()
    };
  });

  test('creates a webpack client config', () => {
    watchWebpack(batfishConfig, server);
    expect(createWebpackConfigClient).toHaveBeenCalledWith(batfishConfig, {
      devServer: true
    });
  });

  test('handles webpack configuration errors', done => {
    const webpackError = new Error();
    webpack.mockImplementationOnce(() => {
      throw webpackError;
    });
    const watcher = watchWebpack(batfishConfig, server);
    expect.hasAssertions();
    watcher.on('error', error => {
      expect(error).toBeInstanceOf(errorTypes.WebpackFatalError);
      expect(error.originalError).toBe(webpackError);
      done();
    });
  });

  test("starts webpack's watch", done => {
    watchWebpack(batfishConfig, server);
    process.nextTick(() => {
      expect(webpack.compiler.watch).toHaveBeenCalledTimes(1);
      expect(webpack.compiler.watch.mock.calls[0][0]).toEqual({
        ignored: [/node_modules/, '/mock/pages/directory/**/*.{js,md}']
      });
      expect(webpack.compiler.watch.mock.calls[0][1]).toBeInstanceOf(Function);
      done();
    });
  });

  test('starts the context watcher', done => {
    watchWebpack(batfishConfig, server);
    process.nextTick(() => {
      expect(watchContext).toHaveBeenCalledTimes(1);
      expect(watchContext.mock.calls[0][0]).toBe(batfishConfig);
      expect(watchContext.mock.calls[0][1]).toHaveProperty('onError');
      expect(watchContext.mock.calls[0][1]).toHaveProperty('afterCompilation');
      done();
    });
  });

  test('catches errors from context watcher', done => {
    const expectedError = new Error();
    const watcher = watchWebpack(batfishConfig, server);
    watcher.on('error', error => {
      expect(error).toBe(expectedError);
      done();
    });
    process.nextTick(() => {
      watchContext.mock.calls[0][1].onError(expectedError);
    });
  });

  test('on first compilation sends some special notifications', done => {
    const watcher = watchWebpack(batfishConfig, server);
    expect.hasAssertions();
    let notificationCount = 0;
    watcher.on('notification', message => {
      notificationCount += 1;
      if (notificationCount === 1) {
        expect(stripAnsi(message)).toBe('Go!');
      } else if (notificationCount === 2) {
        expect(message).toBe('server initialization message');
      } else {
        expect(message).not.toMatch(/(Go|server initialization)/);
      }
    });
    process.nextTick(() => {
      // Invoke the watcher callback twice.
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('b'));
      done();
    });
  });

  test('handles fatal errors', done => {
    const expectedError = new Error();
    const watcher = watchWebpack(batfishConfig, server);
    expect.hasAssertions();
    watcher.on('error', error => {
      expect(error).toBeInstanceOf(errorTypes.WebpackFatalError);
      expect(error.originalError).toBe(expectedError);
      done();
    });
    process.nextTick(() => {
      // Invoke the watcher callback with an error.
      webpack.compiler.watch.mock.calls[0][1](
        expectedError,
        createMockStats('a')
      );
    });
  });

  test('handles errors in stats', done => {
    const erroneousStats = createMockStats('a');
    erroneousStats.hasErrors.mockReturnValue(true);
    const watcher = watchWebpack(batfishConfig, server);
    expect.hasAssertions();
    watcher.on('error', error => {
      expect(error).toBeInstanceOf(errorTypes.WebpackCompilationError);
      expect(error.stats).toBe(erroneousStats);
      done();
    });
    process.nextTick(() => {
      // Invoke the watcher callback with an error.
      webpack.compiler.watch.mock.calls[0][1](null, erroneousStats);
    });
  });

  test('on every new compilation, writes stats', done => {
    watchWebpack(batfishConfig, server);
    process.nextTick(() => {
      const firstStats = createMockStats('a');
      webpack.compiler.watch.mock.calls[0][1](null, firstStats);
      expect(writeWebpackStats).toHaveBeenCalledTimes(1);
      expect(writeWebpackStats).toHaveBeenCalledWith(
        batfishConfig.outputDirectory,
        firstStats
      );
      const secondStats = createMockStats('b');
      webpack.compiler.watch.mock.calls[0][1](null, secondStats);
      expect(writeWebpackStats).toHaveBeenCalledTimes(2);
      expect(writeWebpackStats).toHaveBeenCalledWith(
        batfishConfig.outputDirectory,
        secondStats
      );
      done();
    });
  });

  test('handles errors writing stats', done => {
    const expectedError = new Error();
    writeWebpackStats.mockReturnValueOnce(Promise.reject(expectedError));
    const watcher = watchWebpack(batfishConfig, server);
    watcher.on('error', error => {
      expect(error).toBe(expectedError);
      done();
    });
    return Promise.resolve().then(() => {
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      expect(writeWebpackStats).toHaveBeenCalledTimes(1);
    });
  });

  test('on every new compilation, reloads', done => {
    expect.hasAssertions();
    watchWebpack(batfishConfig, server);
    process.nextTick(() => {
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      expect(server.reload).toHaveBeenCalledTimes(1);
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('b'));
      expect(server.reload).toHaveBeenCalledTimes(2);
      done();
    });
  });

  test('new compilations without new hashes do nothing', done => {
    expect.hasAssertions();
    watchWebpack(batfishConfig, server);
    process.nextTick(() => {
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      expect(server.reload).toHaveBeenCalledTimes(1);
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      expect(server.reload).toHaveBeenCalledTimes(1);
      webpack.compiler.watch.mock.calls[0][1](null, createMockStats('a'));
      expect(server.reload).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
