'use strict';

const staticServerMiddleware = require('../src/node/static-server-middleware');

describe('staticServerMiddleware', () => {
  describe('without any internal routing', () => {
    let middleware;
    beforeEach(() => {
      const batfishConfig = {
        siteBasePath: '/test'
      };
      const pagesData = {
        foo: { path: '/foo', frontMatter: {} },
        bar: { path: '/bar', frontMatter: {} }
      };
      middleware = staticServerMiddleware(batfishConfig, pagesData);
    });

    test('provides only one middleware function', () => {
      expect(middleware.length).toBe(1);
    });

    // TODO: more tests
  });
});
