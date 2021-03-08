'use strict';

const findMatchingRoute = require('../src/webpack/find-matching-route')
  .findMatchingRoute;
/* eslint-disable node/no-missing-require */
// This gets the mock value defined below.
const batfishContext = require('batfish-internal/context').batfishContext;
/* eslint-enable node/no-missing-require */

jest.mock(
  'batfish-internal/context',
  () => {
    return {
      batfishContext: {
        routes: [
          {
            path: '/foo/',
            getPage: () => Promise.resolve()
          },
          {
            path: '/foo/bar/',
            getPage: () => Promise.resolve()
          },
          // Deals with internal routing.
          {
            path: '/foo/bar/baz/',
            getPage: () => Promise.resolve(),
            internalRouting: true
          },
          // Deals with 404.
          {
            path: '/404/',
            getPage: () => Promise.resolve(),
            is404: true
          }
        ],
        notFoundRoute: {
          path: '/404/',
          getPage: () => Promise.resolve(),
          is404: true
        }
      }
    };
  },
  { virtual: true }
);

describe('findMatchingRoute', () => {
  test('exact match', () => {
    expect(findMatchingRoute('/foo/')).toBe(batfishContext.routes[0]);
  });

  test('input ends in index.html', () => {
    expect(findMatchingRoute('/foo/index.html')).toBe(batfishContext.routes[0]);
  });

  test('input lacks trailing slash', () => {
    expect(findMatchingRoute('/foo/bar')).toBe(batfishContext.routes[1]);
  });

  test('route with internal routing matches sub-routes', () => {
    expect(findMatchingRoute('/foo/bar/baz/woo')).toBe(
      batfishContext.routes[2]
    );
  });

  test('if no match is found, returns 404 route', () => {
    expect(findMatchingRoute('/bar/')).toBe(batfishContext.notFoundRoute);
  });
});
