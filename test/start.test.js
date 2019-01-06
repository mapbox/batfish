'use strict';

const start = require('../src/node/start');
const compileStylesheets = require('../src/node/compile-stylesheets');
const watchCss = require('../src/node/watch-css');
const watchWebpack = require('../src/node/watch-webpack');
const maybeClearOutputDirectory = require('../src/node/maybe-clear-output-directory');
const constants = require('../src/node/constants');
const validateConfig = require('../src/node/validate-config');
const devServer = require('../src/node/dev-server');
const nonPageFiles = require('../src/node/non-page-files');

jest.mock('../src/node/get-port', () => ({
  getPort: jest.fn(() => Promise.resolve('mock-port')),
  portInUsageMessages: jest.fn(() => Promise.resolve('mock-port'))
}));

jest.mock('../src/node/create-webpack-config-client', () => {
  return jest.fn(() => Promise.resolve({ mockConfigClient: true }));
});

jest.mock('../src/node/compile-stylesheets', () => {
  return jest.fn(() => Promise.resolve('mock-stylesheet.css'));
});

jest.mock('../src/node/watch-css', () => jest.fn());

jest.mock('../src/node/watch-webpack', () => jest.fn());

jest.mock('../src/node/dev-server', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/non-page-files', () => {
  return {
    watch: jest.fn(),
    copy: jest.fn(() => Promise.resolve())
  };
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
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('creates a server', done => {
    validateConfig.mockValidatedConfig.siteBasePath = '/walk/';
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(devServer).toHaveBeenCalledTimes(1);
      expect(devServer).toHaveBeenCalledWith(
        validateConfig.mockValidatedConfig,
        'mock-port'
      );
      done();
    });
  });

  test('handles errors when creating a server', done => {
    const expectedError = new Error();
    devServer.mockImplementationOnce(() => {
      throw expectedError;
    });
    const emitter = start();
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
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
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
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
      expect(watchCss.mock.calls[0][1].onNotification).toBeInstanceOf(Function);
      done();
    });
  });

  test('catches errors from the css watcher', done => {
    const expectedError = new Error();
    const emitter = start();
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
    });
    process.nextTick(() => {
      watchCss.mock.calls[0][1].onError(expectedError);
      done();
    });
  });

  test('handles notifications from the css watcher', done => {
    const expectedMessage = 'mock message';
    const emitter = start();
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      if (message === expectedMessage) {
        done();
      }
    });
    process.nextTick(() => {
      watchCss.mock.calls[0][1].onNotification(expectedMessage);
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
      expect(watchWebpack.mock.calls[0][1].onError).toBeInstanceOf(Function);
      expect(watchWebpack.mock.calls[0][1].onNotification).toBeInstanceOf(
        Function
      );
      expect(watchWebpack.mock.calls[0][1].onFirstCompile).toBeInstanceOf(
        Function
      );
      done();
    });
  });

  test('catches webpack watcher unexpected errors', done => {
    const expectedError = new Error();
    watchWebpack.mockImplementationOnce(() => {
      throw expectedError;
    });
    const emitter = start();
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('catches webpack watcher expected errors', done => {
    const expectedError = new Error();
    watchWebpack.mockImplementationOnce((config, { onError }) => {
      onError(expectedError);
    });
    const emitter = start();
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('catches webpack watcher notifications', done => {
    watchWebpack.mockImplementationOnce((config, { onNotification }) => {
      onNotification('mock-notification');
    });
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      if (message === 'mock-notification') {
        done();
      }
    });
  });

  test('starts the non-page-file watcher', done => {
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(nonPageFiles.watch).toHaveBeenCalledTimes(1);
      expect(nonPageFiles.watch.mock.calls[0][0]).toHaveProperty(
        'outputDirectory',
        '/mock/output'
      );
      expect(nonPageFiles.watch.mock.calls[0][1].onError).toBeInstanceOf(
        Function
      );
      expect(nonPageFiles.watch.mock.calls[0][1].onNotification).toBeInstanceOf(
        Function
      );
      done();
    });
  });

  test('catches non-page-file watcher unexpected errors', done => {
    const expectedError = new Error();
    nonPageFiles.watch.mockImplementationOnce(() => {
      throw expectedError;
    });
    const emitter = start();
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('catches non-page-file watcher expected errors', done => {
    const expectedError = new Error();
    nonPageFiles.watch.mockImplementationOnce((config, { onError }) => {
      onError(expectedError);
    });
    const emitter = start();
    expect.hasAssertions();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('catches non-page-file watcher notifications', done => {
    nonPageFiles.watch.mockImplementationOnce((config, { onNotification }) => {
      onNotification('mock-notification');
    });
    const emitter = start();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      if (message === 'mock-notification') {
        done();
      }
    });
  });
});

function logEmitterError(error) {
  console.error(error); // eslint-disable-line no-console
}
