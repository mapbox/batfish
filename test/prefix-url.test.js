'use strict';

const prefixUrl = require('../src/webpack/public/prefix-url').prefixUrl;
const prefixUrlAbsolute =
  require('../src/webpack/public/prefix-url').prefixUrlAbsolute;

describe('prefixUrl', () => {
  beforeEach(() => {
    prefixUrl._configure();
  });

  afterEach(() => {
    prefixUrl._configure();
  });

  test('prefixUrl without starting slash', () => {
    expect(prefixUrl('foo')).toBe('/foo');
  });

  test('prefixUrl with starting slash', () => {
    expect(prefixUrl('/foo')).toBe('/foo');
  });

  test('prefixUrlAbsolute throws', () => {
    expect(() => prefixUrlAbsolute('/foo')).toThrow();
  });
});

describe('_configure provides prefixUrl with siteBasePath and siteOrigin', () => {
  beforeEach(() => {
    prefixUrl._configure('/foo/bar', 'https://www.test.com');
  });

  afterEach(() => {
    prefixUrl._configure();
  });

  test('prefixUrl without starting slash', () => {
    expect(prefixUrl('baz')).toBe('/foo/bar/baz');
  });

  test('prefixUrl with starting slash', () => {
    expect(prefixUrl('/baz')).toBe('/foo/bar/baz');
  });

  test('prefixUrl passed already-prefixed root-relative URL is ok', () => {
    expect(prefixUrl('/foo/bar/baz')).toBe('/foo/bar/baz');
  });

  test('prefixUrl passed absolute URL returns it', () => {
    expect(prefixUrl('https://www.foo.com/bar')).toBe(
      'https://www.foo.com/bar'
    );
  });

  test('prefixUrlAbsolute with starting slash', () => {
    expect(prefixUrlAbsolute('/baz')).toBe('https://www.test.com/foo/bar/baz');
  });

  test('prefixUrlAbsolute without starting slash', () => {
    expect(prefixUrlAbsolute('baz')).toBe('https://www.test.com/foo/bar/baz');
  });

  test('prefixUrlAbsolute passed absolute URL returns it', () => {
    expect(prefixUrlAbsolute('https://www.foo.com/bar')).toBe(
      'https://www.foo.com/bar'
    );
  });
});
