'use strict';

const joinUrlParts = require('../lib/join-url-parts');

describe('joinUrlParts', () => {
  test('with no arguments returns empty string', () => {
    expect(joinUrlParts()).toBe('');
  });

  test('concatenates with slashes between arguments', () => {
    expect(joinUrlParts('foo', 'bar', 'baz')).toBe('foo/bar/baz');
  });

  test('does not duplicate slashes if arguments end with them', () => {
    expect(joinUrlParts('foo/', 'bar/', 'baz')).toBe('foo/bar/baz');
  });

  test('does not duplicate slashes if arguments being with them', () => {
    expect(joinUrlParts('/foo', '/bar', '/baz', '/pit')).toBe(
      '/foo/bar/baz/pit'
    );
  });

  test('ends with a slash if last argument is an empty string', () => {
    expect(joinUrlParts('/baz', '')).toBe('/baz/');
  });
});
