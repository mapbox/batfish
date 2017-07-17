'use strict';

const mkdirp = require('mkdirp');
const del = require('del');
const path = require('path');
const validateConfig = require('../lib/validate-config');

jest.mock('mkdirp', () => {
  return {
    sync: jest.fn()
  };
});

jest.mock('del', () => {
  return {
    sync: jest.fn()
  };
});

describe('validateConfig', () => {
  const projectDirectory = '/my-project';
  test('defaults', () => {
    const config = validateConfig(undefined, projectDirectory);
    // Make wrapperPath a relative path, not absolute
    config.wrapperPath = path.relative(
      path.dirname(path.join(__dirname, '../lib/validate-config')),
      config.wrapperPath
    );
    expect(config).toMatchSnapshot();
  });

  test('invalid configuration properties fails', () => {
    const invalidPropertyConfig = {
      port: 8080,
      fakePort: 1337
    };
    expect(() => validateConfig(invalidPropertyConfig)).toThrow(
      'fakePort is an invalid config property'
    );
    const invalidPropertiesConfig = {
      fakeProduction: true,
      fakePort: 1337,
      fakeExternalStylesheets: null
    };
    expect(() => validateConfig(invalidPropertiesConfig)).toThrow(
      'fakeProduction, fakePort, fakeExternalStylesheets are invalid config properties'
    );
  });

  test('temporaryDirectory is created and cleared', () => {
    const result = validateConfig(undefined, projectDirectory);
    expect(mkdirp.sync).toHaveBeenCalledTimes(1);
    expect(mkdirp.sync).toHaveBeenCalledWith(result.temporaryDirectory);
    expect(del.sync).toHaveBeenCalledTimes(1);
    expect(del.sync).toHaveBeenCalledWith(
      path.join(result.temporaryDirectory, '{*.*,.*}'),
      { force: true }
    );
  });

  test('non-absolute pagesDirectory fails', () => {
    const config = {
      pagesDirectory: '../some/directory'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      'pagesDirectory must be an absolute path'
    );
  });

  test('non-absolute outputDirectory fails', () => {
    const config = {
      outputDirectory: '../some/directory'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      'outputDirectory must be an absolute path'
    );
  });

  test('non-absolute wrapperPath fails', () => {
    const config = {
      wrapperPath: '../some/directory.wrapper.js'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      'wrapperPath must be an absolute path'
    );
  });

  test('non-absolute temporary fails', () => {
    const config = {
      temporaryDirectory: '../some/directory'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      'temporaryDirectory must be an absolute path'
    );
  });

  test('processed siteOrigin does not end with a slash', () => {
    expect(
      validateConfig(
        {
          siteOrigin: 'https://www.mapbox.com/'
        },
        projectDirectory
      ).siteOrigin
    ).toBe('https://www.mapbox.com');

    expect(
      validateConfig(
        {
          siteOrigin: 'https://www.mapbox.com'
        },
        projectDirectory
      ).siteOrigin
    ).toBe('https://www.mapbox.com');
  });

  test('processed siteBasePath does not end with a slash unless it is only a slash', () => {
    expect(
      validateConfig(
        {
          siteBasePath: 'about/team/'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: 'about/team'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: '/'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('/');
  });

  test('processed siteBasePath always starts with a slash', () => {
    expect(
      validateConfig(
        {
          siteBasePath: 'about/team/'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: '/about/team'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: '/'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('/');
  });
});
