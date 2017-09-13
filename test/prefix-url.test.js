'use strict';

// eslint-disable-next-line node/no-missing-require
const batfishContextModule = require('batfish-internal/context');
const prefixUrl = require('../src/webpack/public/prefix-url').prefixUrl;
const prefixUrlAbsolute = require('../src/webpack/public/prefix-url')
  .prefixUrlAbsolute;

jest.mock(
  'batfish-internal/context',
  () => {
    return {
      batfishContext: {}
    };
  },
  { virtual: true }
);

describe('prefixUrl', () => {
  beforeEach(() => {
    batfishContextModule.batfishContext = {
      selectedConfig: {
        siteBasePath: '',
        siteOrigin: ''
      }
    };
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

describe('createPrefixUrl generated module with siteBasePath and siteOrigin', () => {
  beforeEach(() => {
    batfishContextModule.batfishContext = {
      selectedConfig: {
        siteBasePath: '/foo/bar',
        siteOrigin: 'https://www.test.com'
      }
    };
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
