'use strict';

const prefixUrl = require('../src/prefix-url');

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

  test('prefixUrl.absolute throws', () => {
    expect(() => prefixUrl.absolute('/foo')).toThrow();
  });
});

describe('createPrefixUrl generated module with siteBasePath and siteOrigin', () => {
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

  test('prefixUrl.absolute with starting slash', () => {
    expect(prefixUrl.absolute('/baz')).toBe('https://www.test.com/foo/bar/baz');
  });

  test('prefixUrl.absolute without starting slash', () => {
    expect(prefixUrl.absolute('baz')).toBe('https://www.test.com/foo/bar/baz');
  });
});
