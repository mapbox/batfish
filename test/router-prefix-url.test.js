'use strict';

// eslint-disable-next-line node/no-missing-require
const prefixUrl = require('@mapbox/batfish/modules/prefix-url').prefixUrl;

jest.mock(
  '@mapbox/batfish/modules/prefix-url',
  () => {
    const prefixUrl = jest.fn();
    prefixUrl._configure = jest.fn();
    return { prefixUrl };
  },
  { virtual: true }
);

jest.mock(
  'batfish-internal/context',
  () => {
    return {
      batfishContext: {
        selectedConfig: {
          siteBasePath: 'mockSiteBasePath',
          siteOrigin: 'mockSiteOrigin',
          hijackLinks: true
        }
      }
    };
  },
  { virtual: true }
);

jest.mock('@mapbox/batfish/modules/route-to', () => {}, { virtual: true });
jest.mock('@mapbox/batfish/modules/route-change-listeners', () => {}, {
  virtual: true
});

test('when Router is required, it configures prefixUrl', () => {
  expect(prefixUrl._configure).toHaveBeenCalledTimes(0);
  require('../src/webpack/router');
  expect(prefixUrl._configure).toHaveBeenCalledTimes(1);
  expect(prefixUrl._configure).toHaveBeenCalledWith(
    'mockSiteBasePath',
    'mockSiteOrigin'
  );
});
