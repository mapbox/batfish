'use strict';

const mkdirp = require('mkdirp');
const del = require('del');
const path = require('path');
const validateConfig = require('../lib/validate-config');
const errorTypes = require('../lib/error-types');

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
    // Make applicationWrapperPath a relative path, not absolute
    config.applicationWrapperPath = path.relative(
      path.dirname(path.join(__dirname, '../lib/validate-config')),
      config.applicationWrapperPath
    );
    expect(config).toMatchSnapshot();
  });

  test('invalid configuration properties fails', () => {
    const invalidPropertyConfig = {
      port: 8080,
      fakePort: 1337
    };
    expect(() => validateConfig(invalidPropertyConfig)).toThrow(
      errorTypes.ConfigValidationError
    );
    const invalidPropertiesConfig = {
      fakeProduction: true,
      fakePort: 1337,
      fakeExternalStylesheets: null
    };
    expect(() => validateConfig(invalidPropertiesConfig)).toThrow(
      errorTypes.ConfigValidationError
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
      errorTypes.ConfigValidationError
    );
  });

  test('non-absolute outputDirectory fails', () => {
    const config = {
      outputDirectory: '../some/directory'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      errorTypes.ConfigValidationError
    );
  });

  test('non-absolute applicationWrapperPath fails', () => {
    const config = {
      applicationWrapperPath: '../some/directory.wrapper.js'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      errorTypes.ConfigValidationError
    );
  });

  test('non-absolute temporary fails', () => {
    const config = {
      temporaryDirectory: '../some/directory'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      errorTypes.ConfigValidationError
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

  test('fileLoaderExtensions transform function', () => {
    expect(
      validateConfig({
        fileLoaderExtensions: defaults => defaults.concat('svg')
      }).fileLoaderExtensions
    ).toMatchSnapshot();
  });
});
