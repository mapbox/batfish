'use strict';

const validateConfig = require('../lib/validate-config');

describe('validateConfig', () => {
  const projectDirectory = '/my-project';
  test('defaults', () => {
    expect(validateConfig(undefined, projectDirectory)).toMatchSnapshot();
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
      'wrapperPath is required and must be an absolute path'
    );
  });

  test('non-absolute temporary fails', () => {
    const config = {
      temporaryDirectory: '../some/directory'
    };
    expect(() => validateConfig(config, projectDirectory)).toThrow(
      'temporaryDirectory is required and must be an absolute path'
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
    ).toBe('about/team');

    expect(
      validateConfig(
        {
          siteBasePath: 'about/team'
        },
        projectDirectory
      ).siteBasePath
    ).toBe('about/team');

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
