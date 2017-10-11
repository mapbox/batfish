'use strict';

const stripAnsi = require('strip-ansi');
const start = require('../src/node/start');
const compileStylesheets = require('../src/node/compile-stylesheets');
const watchCss = require('../src/node/watch-css');
const watchWebpack = require('../src/node/watch-webpack');
const createServer = require('../src/node/create-server');
const maybeClearOutputDirectory = require('../src/node/maybe-clear-output-directory');
const constants = require('../src/node/constants');
const validateConfig = require('../src/node/validate-config');

jest.mock('../src/node/create-webpack-config-client', () => {
  return jest.fn(() => Promise.resolve({ mockConfigClient: true }));
});

jest.mock('../src/node/compile-stylesheets', () => {
  return jest.fn(() => Promise.resolve('mock-stylesheet.css'));
});

jest.mock('../src/node/watch-css', () => {
  return jest.fn();
});

jest.mock('../src/node/watch-webpack', () => {
  const mockWebpackEmitter = {
    on: jest.fn()
  };
  const fn = jest.fn(() => mockWebpackEmitter);
  fn.mockWebpackEmitter = mockWebpackEmitter;
  return fn;
});

jest.mock('../src/node/create-server', () => {
  const mockServer = {
    start: jest.fn(),
    reload: jest.fn()
  };
  const fn = jest.fn(() => mockServer);
  fn.mockServer = mockServer;
  return fn;
});

jest.mock('../src/node/maybe-clear-output-directory', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/validate-config', () => {
  const fn = jest.fn(() => fn.mockValidatedConfig);
  fn.mockValidatedConfig = {};
  return fn;
});

describe('start', () => {
  beforeEach(() => {
    validateConfig.mockValidatedConfig = {
      port: 6666,
      publicAssetsPath: 'assets',
      outputDirectory: '/mock/output',
      pagesDirectory: '/mock/pages'
    };
  });

  test('validates the config', () => {
    const rawConfig = {
      foo: 'bar'
    };
    const emitter = start(rawConfig, 'project-directory');
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(validateConfig).toHaveBeenCalledWith(
      { foo: 'bar' },
      'project-directory'
    );
  });

  test('catches errors while validating config', done => {
    const expectedError = new Error();
    validateConfig.mockImplementationOnce(() => {
      throw expectedError;
    });
    const emitter = start({ badProperty: true });
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('creates a server', () => {
    validateConfig.mockValidatedConfig.siteBasePath = '/walk/';
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(createServer).toHaveBeenCalledTimes(1);
    const createServerOptions = createServer.mock.calls[0][0];
    expect(createServerOptions.onError).toBeInstanceOf(Function);
    expect(createServerOptions.browserSyncOptions).toHaveProperty('port', 6666);
    expect(createServerOptions.browserSyncOptions).toHaveProperty('server');
    expect(createServerOptions.browserSyncOptions.server).toHaveProperty(
      'baseDir',
      '/mock/output'
    );
    expect(createServerOptions.browserSyncOptions.server).toHaveProperty(
      'routes'
    );
    expect(createServerOptions.browserSyncOptions.server.routes).toHaveProperty(
      '/walk/assets',
      '/mock/output'
    );
    expect(createServerOptions.browserSyncOptions.server.routes).toHaveProperty(
      '/walk/',
      '/mock/pages'
    );
  });

  test('handles errors when creating a server', done => {
    const expectedError = new Error();
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
    const onError = createServer.mock.calls[0][0].onError;
    onError(expectedError);
  });

  test('maybe clears the output directory', () => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(maybeClearOutputDirectory).toHaveBeenCalledTimes(1);
    expect(maybeClearOutputDirectory.mock.calls[0][0]).toHaveProperty(
      'outputDirectory',
      '/mock/output'
    );
  });

  test('compiles stylesheets', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(compileStylesheets).toHaveBeenCalledTimes(1);
      expect(compileStylesheets.mock.calls[0][0]).toHaveProperty(
        'outputDirectory',
        '/mock/output'
      );
      done();
    });
  });

  test('handles errors in stylesheet compilation', done => {
    const expectedError = new Error();
    compileStylesheets.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('starts the server it creates', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(createServer.mockServer.start).toHaveBeenCalledTimes(1);
      done();
    });
  });

  test('starts the css watcher', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(watchCss).toHaveBeenCalledTimes(1);
      expect(watchCss.mock.calls[0][0]).toHaveProperty(
        'outputDirectory',
        '/mock/output'
      );
      expect(watchCss.mock.calls[0][1].onError).toBeInstanceOf(Function);
      expect(watchCss.mock.calls[0][1].afterCompilation).toBeInstanceOf(
        Function
      );
      done();
    });
  });

  test('catches errors from the css watcher', done => {
    const expectedError = new Error();
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
    });
    process.nextTick(() => {
      watchCss.mock.calls[0][1].onError(expectedError);
      done();
    });
  });

  test('reloads the server after CSS compilation', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      watchCss.mock.calls[0][1].afterCompilation('a-file.txt');
      expect(createServer.mockServer.reload).toHaveBeenCalledWith('a-file.txt');
      done();
    });
  });

  test('starts the webpack watcher', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(watchWebpack).toHaveBeenCalledTimes(1);
      expect(watchWebpack.mock.calls[0][0]).toHaveProperty(
        'outputDirectory',
        '/mock/output'
      );
      expect(watchWebpack.mock.calls[0][1]).toBe(createServer.mockServer);
      done();
    });
  });

  test('catches webpack watcher errors', done => {
    const expectedError = new Error();
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
    process.nextTick(() => {
      watchWebpack.mockWebpackEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_ERROR
      )[1](expectedError);
    });
  });

  test('catches webpack watcher notifications', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      if (message === 'foo') {
        done();
      }
    });
    process.nextTick(() => {
      watchWebpack.mockWebpackEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_NOTIFICATION
      )[1]('foo');
    });
  });

  test('order of notifications', done => {
    const notifications = [];
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      notifications.push(stripAnsi(message));
    });
    process.nextTick(() => {
      const cssAfterCompilation = watchCss.mock.calls[0][1].afterCompilation;
      const webpackWatcherNotificationHandler = watchWebpack.mockWebpackEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_NOTIFICATION
      )[1];
      cssAfterCompilation('a-file.txt');
      webpackWatcherNotificationHandler('Webpack notification 1');
      cssAfterCompilation('b-file.txt');
      webpackWatcherNotificationHandler('Webpack notification 2');
      process.nextTick(() => {
        expect(notifications).toMatchSnapshot();
        done();
      });
    });
  });
});

function logEmitterError(error) {
  console.error(error.stack); // eslint-disable-line no-console
}
