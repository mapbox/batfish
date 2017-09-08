'use strict';

const serveStatic = require('../src/node/serve-static');
const staticServerMiddlewares = require('../src/node/static-server-middlewares');
const createServer = require('../src/node/create-server');
const constants = require('../src/node/constants');
const validateConfig = require('../src/node/validate-config');

jest.mock('../src/node/static-server-middlewares', () => {
  return {
    init: jest.fn(() => ({ stripSiteBasePath: 'mockStripSiteBasePath' }))
  };
});

jest.mock('../src/node/create-server', () => {
  const mockServer = {
    browserSyncInstance: {
      emitter: {
        on: jest.fn()
      }
    },
    start: jest.fn()
  };
  const fn = jest.fn(() => mockServer);
  fn.mockServer = mockServer;
  return fn;
});

jest.mock('../src/node/server-init-message', () => {
  return jest.fn(() => 'server initialization message');
});

jest.mock('../src/node/validate-config', () => {
  const fn = jest.fn(() => fn.mockValidatedConfig);
  fn.mockValidatedConfig = {};
  return fn;
});

describe('serveStatic', () => {
  beforeEach(() => {
    validateConfig.mockValidatedConfig = {
      port: 6666,
      outputDirectory: '/mock/output',
      pagesDirectory: '/mock/pages'
    };
  });

  test('validates the config', () => {
    const rawConfig = {
      foo: 'bar'
    };
    const emitter = serveStatic(rawConfig, 'project-directory');
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
    const emitter = serveStatic({ badProperty: true });
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('initializes middlewares with config', () => {
    const emitter = serveStatic({ port: 6666 });
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(staticServerMiddlewares.init).toHaveBeenCalledWith(
      expect.objectContaining({ port: 6666 })
    );
  });

  test('creates a server', () => {
    const emitter = serveStatic();
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
    expect(
      createServerOptions.browserSyncOptions.server
    ).toHaveProperty('middleware', ['mockStripSiteBasePath']);
  });

  test('catches errors when creating the server', done => {
    const expectedError = new Error();
    const emitter = serveStatic();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
    createServer.mock.calls[0][0].onError(expectedError);
  });

  test('starts the server', () => {
    const emitter = serveStatic();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(createServer.mockServer.start).toHaveBeenCalledTimes(1);
  });

  test('when the server initializes sends a message', done => {
    const emitter = serveStatic();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(
      createServer.mockServer.browserSyncInstance.emitter.on
    ).toHaveBeenCalledTimes(1);
    expect(
      createServer.mockServer.browserSyncInstance.emitter.on.mock.calls[0][0]
    ).toBe('init');
    process.nextTick(() => {
      emitter.on(constants.EVENT_NOTIFICATION, message => {
        expect(message).toBe('server initialization message');
        done();
      });
      // Manually invoke the init handler.
      createServer.mockServer.browserSyncInstance.emitter.on.mock.calls[0][1]();
    });
  });
});

function logEmitterError(error) {
  console.error(error.stack); // eslint-disable-line no-console
}
