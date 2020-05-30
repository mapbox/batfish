'use strict';

const routeTo = require('../src/webpack/public/route-to').routeTo;
const routeToPrefixed = require('../src/webpack/public/route-to')
  .routeToPrefixed;

jest.mock('../src/webpack/public/prefix-url', () => {
  return {
    prefixUrl: jest.fn((url) => `prefixed/${url}`),
  };
});

describe('routeTo', () => {
  let routeToHandler = jest.fn();

  afterEach(() => {
    routeTo._clearRouteToHandler();
  });

  test('calls the handler', () => {
    routeTo._setRouteToHandler(routeToHandler);
    routeTo('foo/bar');
    expect(routeToHandler).toHaveBeenCalledTimes(1);
    expect(routeToHandler).toHaveBeenCalledWith('foo/bar');
  });

  test('once the handler is added called delayed URL', () => {
    routeTo('foo/bar');
    routeTo('foo/bar/baz');
    expect(routeToHandler).toHaveBeenCalledTimes(0);
    routeTo._setRouteToHandler(routeToHandler);
    expect(routeToHandler).toHaveBeenCalledTimes(1);
    expect(routeToHandler).toHaveBeenCalledWith('foo/bar');
  });
});

describe('routeToPrefixed', () => {
  let routeToHandler = jest.fn();

  afterEach(() => {
    routeTo._clearRouteToHandler();
  });

  test('calls the handler', () => {
    routeTo._setRouteToHandler(routeToHandler);
    routeToPrefixed('foo/bar');
    expect(routeToHandler).toHaveBeenCalledTimes(1);
    expect(routeToHandler).toHaveBeenCalledWith('prefixed/foo/bar');
  });

  test('once the handler is added called delayed URL', () => {
    routeToPrefixed('foo/bar');
    routeToPrefixed('foo/bar/baz');
    expect(routeToHandler).toHaveBeenCalledTimes(0);
    routeTo._setRouteToHandler(routeToHandler);
    expect(routeToHandler).toHaveBeenCalledTimes(1);
    expect(routeToHandler).toHaveBeenCalledWith('prefixed/foo/bar');
  });
});
