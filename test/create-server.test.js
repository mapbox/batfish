'use strict';

const browserSync = require('browser-sync');
const getPort = require('get-port');
const createServer = require('../src/node/create-server');

jest.mock('browser-sync', () => {
  const instance = {
    emitter: {
      on: jest.fn()
    },
    reload: jest.fn(),
    init: jest.fn()
  };
  return {
    create: jest.fn(() => instance),
    get: () => instance
  };
});

jest.mock('get-port', () => {
  return jest.fn(() => Promise.resolve(1234));
});

describe('createServer', () => {
  test('initializes', () => {
    const browserSyncOptions = {};
    const onError = jest.fn();
    const server = createServer({ browserSyncOptions, onError });
    expect(browserSync.create).toHaveBeenCalledTimes(1);
    expect(browserSync.get().emitter.on).toHaveBeenCalledTimes(1);
    expect(browserSync.get().emitter.on).toHaveBeenCalledWith('error', onError);
    expect(server.browserSyncInstance).toBe(browserSync.get());
  });

  test('start', () => {
    const browserSyncOptions = { foo: 'bar', baz: 7, port: 9876 };
    const onError = jest.fn();
    const server = createServer({ browserSyncOptions, onError });
    server.start();
    expect(getPort).toHaveBeenCalledTimes(1);
    expect(getPort).toHaveBeenCalledWith(9876);
    return Promise.resolve().then(() => {
      expect(browserSync.get().init).toHaveBeenCalledTimes(1);
      expect(browserSync.get().init).toHaveBeenCalledWith({
        foo: 'bar',
        baz: 7,
        port: 1234
      });
    });
  });

  test('start catches getPort errors', () => {
    const error = new Error();
    getPort.mockReturnValue(Promise.reject(error));
    const browserSyncOptions = { foo: 'bar', baz: 7, port: 9876 };
    const onError = jest.fn();
    const server = createServer({ browserSyncOptions, onError });
    server.start();
    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  test('reload works', () => {
    const browserSyncOptions = {};
    const onError = jest.fn();
    const server = createServer({ browserSyncOptions, onError });
    server.reload('tumbleweed.txt');
    expect(browserSync.get().reload).toHaveBeenCalledTimes(1);
    expect(browserSync.get().reload).toHaveBeenCalledWith('tumbleweed.txt');
  });
});
