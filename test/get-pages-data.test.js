'use strict';

const path = require('path');
const getPagesData = require('../src/node/get-pages-data');
const validateConfig = require('../src/node/validate-config');

describe('getPagesData', () => {
  const fixtureDir = path.join(__dirname, 'fixtures/get-pages-data');
  test('registers home page', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/']).not.toBeUndefined();
      expect(result['/'].filePath).toMatch(/get-pages-data\/index\.js$/);
    });
  });

  test('registers JS index page', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/about/']).not.toBeUndefined();
      expect(result['/about/'].filePath).toMatch(
        /get-pages-data\/about\/index\.js$/
      );
    });
  });

  test('registers JS non-index page', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/work/animals/horses/ed/']).not.toBeUndefined();
      expect(result['/work/animals/horses/ed/'].filePath).toMatch(
        /get-pages-data\/work\/animals\/horses\/ed\.js$/
      );
    });
  });

  test('registers Markdown index page', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/about/team/']).not.toBeUndefined();
      expect(result['/about/team/'].filePath).toMatch(
        /get-pages-data\/about\/team\/index\.md$/
      );
    });
  });

  test('registers Markdown non-index page', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/about/security/']).not.toBeUndefined();
      expect(result['/about/security/'].filePath).toMatch(
        /get-pages-data\/about\/security\.md$/
      );
    });
  });

  test('registers JS index page with siteBasePath', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      siteBasePath: 'foo'
    });
    return getPagesData(config).then(result => {
      expect(result['/foo/about/']).not.toBeUndefined();
      expect(result['/foo/about/'].filePath).toMatch(
        /get-pages-data\/about\/index\.js$/
      );
    });
  });

  test('registers JS non-index page with siteBasePath', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      siteBasePath: '/foo'
    });
    return getPagesData(config).then(result => {
      expect(result['/foo/work/animals/horses/ed/']).not.toBeUndefined();
      expect(result['/foo/work/animals/horses/ed/'].filePath).toMatch(
        /get-pages-data\/work\/animals\/horses\/ed\.js$/
      );
    });
  });

  test('registers Markdown index page with siteBasePath', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      siteBasePath: '/foo/'
    });
    return getPagesData(config).then(result => {
      expect(result['/foo/about/team/']).not.toBeUndefined();
      expect(result['/foo/about/team/'].filePath).toMatch(
        /get-pages-data\/about\/team\/index\.md$/
      );
    });
  });

  test('registers Markdown non-index page with siteBasePath', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      siteBasePath: 'foo'
    });
    return getPagesData(config).then(result => {
      expect(result['/foo/about/security/']).not.toBeUndefined();
      expect(result['/foo/about/security/'].filePath).toMatch(
        /get-pages-data\/about\/security\.md$/
      );
    });
  });

  test('does not duplicate slash on homepage when siteBasePath === /', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      siteBasePath: '/'
    });
    return getPagesData(config).then(result => {
      expect(result['/']).not.toBeUndefined();
      expect(result['/'].filePath).toMatch(/get-pages-data\/index\.js$/);
    });
  });

  test('does not register files that are not JS or Markdown', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/about/style/']).toBeUndefined();
    });
  });

  test('registers JS front matter', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/work/animals/horses/ed/'].frontMatter).toEqual({
        name: "Ed's page"
      });
    });
  });

  test('registers Markdown front matter', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/about/team/'].frontMatter).toEqual({
        name: 'Team page'
      });
    });
  });

  test('includes draft page in development mode', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      production: false
    });
    return getPagesData(config).then(result => {
      expect(result['/about/']).not.toBeUndefined();
    });
  });

  test('does not include draft page in production mode', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      production: true
    });
    return getPagesData(config).then(result => {
      expect(result['/about/']).toBeUndefined();
    });
  });

  test('includes the default 404 page in development mode', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir
    });
    return getPagesData(config).then(result => {
      expect(result['/404/']).not.toBeUndefined();
      expect(result['/404/'].is404).toBe(true);
      expect(result['/404/'].filePath).toMatch(/default-not-found\.js$/);
    });
  });

  test('does not include the default 404 page in production mode', () => {
    const config = validateConfig({
      pagesDirectory: fixtureDir,
      production: true
    });
    return getPagesData(config).then(result => {
      expect(result['/404/']).toBeUndefined();
    });
  });

  test('does not include the default 404 page if there is a custom 404 JS page', () => {
    const config = validateConfig({
      pagesDirectory: path.join(__dirname, 'fixtures/get-pages-data-404-js')
    });
    return getPagesData(config).then(result => {
      expect(result['/404/']).not.toBeUndefined();
      expect(result['/404/'].is404).toBe(true);
      expect(result['/404/'].filePath).not.toMatch(/default-not-found\.js$/);
      expect(result['/404/'].filePath).toMatch(
        /get-pages-data-404-js\/404\.js$/
      );
      expect(result['/404/'].frontMatter).toEqual({
        title: 'Not found'
      });
    });
  });

  test('does not include the default 404 page if there is a custom 404 Markdown page', () => {
    const config = validateConfig({
      pagesDirectory: path.join(__dirname, 'fixtures/get-pages-data-404-md')
    });
    return getPagesData(config).then(result => {
      expect(result['/404/']).not.toBeUndefined();
      expect(result['/404/'].is404).toBe(true);
      expect(result['/404/'].filePath).not.toMatch(/default-not-found\.js$/);
      expect(result['/404/'].filePath).toMatch(
        /get-pages-data-404-md\/404\.md$/
      );
      expect(result['/404/'].frontMatter).toEqual({
        title: 'Not found'
      });
    });
  });
});
