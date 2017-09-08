'use strict';

const staticServerMiddlewares = require('../src/node/static-server-middlewares');

describe('staticServerMiddlewares', () => {
  describe('stripSiteBasePath', () => {
    test('strips siteBasePath from URL', () => {
      const middlewares = staticServerMiddlewares.init({
        siteBasePath: '/foo'
      });
      const req = { url: '/foo/bar/baz' };
      middlewares.stripSiteBasePath(req, {}, () => {
        expect(req).toEqual({ url: '/bar/baz' });
      });
    });

    test('replaces URL that is siteBasePath with /', () => {
      const middlewares = staticServerMiddlewares.init({
        siteBasePath: '/foo'
      });
      const req = { url: '/foo' };
      middlewares.stripSiteBasePath(req, {}, () => {
        expect(req).toEqual({ url: '/' });
      });
    });

    test('ignores URLs that do not start with siteBasePath', () => {
      const middlewares = staticServerMiddlewares.init({
        siteBasePath: '/foo'
      });
      const req = { url: '/bar/foo/baz' };
      middlewares.stripSiteBasePath(req, {}, () => {
        expect(req).toEqual({ url: '/bar/foo/baz' });
      });
    });
  });
});
