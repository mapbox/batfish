'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const del = require('del');
const pify = require('pify');
const tempy = require('tempy');
const createPrefixUrl = require('../lib/create-prefix-url');

describe('createPrefixUrl generation', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'writeFile').mockImplementation((a, b, callback) => {
      callback();
    });
  });

  afterEach(() => {
    fs.writeFile.mockRestore();
  });

  test('works without siteBasePath or siteOrigin', () => {
    const config = {
      temporaryDirectory: '/tmp/dir'
    };
    return createPrefixUrl(config).then(() => {
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile.mock.calls[0][0]).toBe(
        path.join(config.temporaryDirectory, 'prefix-url.js')
      );
      expect(fs.writeFile.mock.calls[0][1]).toMatchSnapshot();
    });
  });

  test('works with siteBasePath and siteOrigin', () => {
    const config = {
      temporaryDirectory: '/tmp/dir',
      siteBasePath: '/foo',
      siteOrigin: 'https://www.test.com'
    };
    return createPrefixUrl(config).then(() => {
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile.mock.calls[0][0]).toBe(
        path.join(config.temporaryDirectory, 'prefix-url.js')
      );
      expect(fs.writeFile.mock.calls[0][1]).toMatchSnapshot();
    });
  });
});

describe('createPrefixUrl generated module without siteBasePath and siteOrigin', () => {
  const tmp = tempy.directory();
  const config = {
    temporaryDirectory: tmp
  };
  let prefixUrl;

  beforeEach(() => {
    return pify(mkdirp)(tmp)
      .then(() => {
        return createPrefixUrl(config);
      })
      .then(filePath => {
        prefixUrl = require(filePath);
      });
  });

  afterEach(() => {
    return del(tmp, { force: true });
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
  const tmp = tempy.directory();
  const config = {
    temporaryDirectory: tmp,
    siteBasePath: '/foo/bar',
    siteOrigin: 'https://www.test.com'
  };
  let prefixUrl;

  beforeEach(() => {
    return pify(mkdirp)(tmp)
      .then(() => {
        return createPrefixUrl(config);
      })
      .then(filePath => {
        prefixUrl = require(filePath);
      });
  });

  afterEach(() => {
    return del(tmp, { force: true });
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
