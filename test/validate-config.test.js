'use strict';

const mkdirp = require('mkdirp');
const del = require('del');
const path = require('path');
const fs = require('fs');
const stripAnsi = require('strip-ansi');
const validateConfig = require('../src/node/validate-config');
const errorTypes = require('../src/node/error-types');
const projectRootSerializer = require('./test-util/project-root-serializer');

expect.addSnapshotSerializer(projectRootSerializer);

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

  beforeEach(() => {
    const realFsExistsSync = fs.existsSync;
    // Allow for the test projectDirectory to work when checking if files exist.
    jest.spyOn(fs, 'existsSync').mockImplementation(input => {
      if (input === `${projectDirectory}/src/pages`) {
        return true;
      }
      return realFsExistsSync(input);
    });
  });

  afterEach(() => {
    fs.existsSync.mockRestore();
  });

  test('defaults', () => {
    const config = validateConfig(undefined, projectDirectory);
    expect(config).toMatchSnapshot();
  });

  test('non-existent configuration properties fails', () => {
    const invalidPropertiesConfig = {
      fakeProduction: true,
      fakePort: 1337,
      fakeExternalStylesheets: null
    };
    expect.hasAssertions();
    try {
      validateConfig(invalidPropertiesConfig);
    } catch (error) {
      expect(error instanceof errorTypes.ConfigValidationError).toBe(true);
      expect(error.messages.map(stripAnsi).sort()).toEqual([
        'fakeExternalStylesheets is not a valid configuration property.',
        'fakePort is not a valid configuration property.',
        'fakeProduction is not a valid configuration property.'
      ]);
    }
  });

  test('invalid configuration values fail', () => {
    // This is not a comprehensive test of all possible failures.
    // It tests enough of configSchema to verify that it is working as expected.
    const invalidValuesConfig = {
      siteBasePath: 7,
      browserslist: ['foo', ['bar', 'baz']],
      dataSelectors: {
        high: 'up'
      },
      production: 'please'
    };
    expect.hasAssertions();
    try {
      validateConfig(invalidValuesConfig);
    } catch (error) {
      expect(error instanceof errorTypes.ConfigValidationError).toBe(true);
      expect(error.messages.map(stripAnsi).sort()).toEqual([
        'browserslist must be a string or array of strings.',
        'dataSelectors must be an object whose values are functions.',
        'production must be a boolean.',
        'siteBasePath must be a string.'
      ]);
    }
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

  test('processed siteOrigin does not end with a slash', () => {
    expect(
      validateConfig(
        {
          siteOrigin: 'https://www.mapbox.com/'
        },
        projectDirectory
      )
    ).toHaveProperty('siteOrigin', 'https://www.mapbox.com');

    expect(
      validateConfig(
        {
          siteOrigin: 'https://www.mapbox.com'
        },
        projectDirectory
      )
    ).toHaveProperty('siteOrigin', 'https://www.mapbox.com');
  });

  test('publicAssetsPath should be configurable', () => {
    expect(validateConfig(undefined, projectDirectory)).toHaveProperty(
      'publicAssetsPath',
      'assets'
    );

    expect(
      validateConfig(
        {
          publicAssetsPath: 'site_assets'
        },
        projectDirectory
      )
    ).toHaveProperty('publicAssetsPath', 'site_assets');
  });

  test('processed siteBasePath does not end with a slash unless it is only a slash', () => {
    expect(
      validateConfig(
        {
          siteBasePath: 'about/team/'
        },
        projectDirectory
      )
    ).toHaveProperty('siteBasePath', '/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: 'about/team'
        },
        projectDirectory
      )
    ).toHaveProperty('siteBasePath', '/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: '/'
        },
        projectDirectory
      )
    ).toHaveProperty('siteBasePath', '/');
  });

  test('processed siteBasePath always starts with a slash', () => {
    expect(
      validateConfig(
        {
          siteBasePath: 'about/team/'
        },
        projectDirectory
      )
    ).toHaveProperty('siteBasePath', '/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: '/about/team'
        },
        projectDirectory
      )
    ).toHaveProperty('siteBasePath', '/about/team');

    expect(
      validateConfig(
        {
          siteBasePath: '/'
        },
        projectDirectory
      )
    ).toHaveProperty('siteBasePath', '/');
  });

  test('fileLoaderExtensions transform function', () => {
    expect(
      validateConfig(
        {
          fileLoaderExtensions: defaults => defaults.concat('svg')
        },
        projectDirectory
      )
    ).toHaveProperty('fileLoaderExtensions', [
      'jpeg',
      'jpg',
      'png',
      'gif',
      'webp',
      'mp4',
      'webm',
      'woff',
      'woff2',
      'svg'
    ]);
  });

  test('stylesheets file paths must exist', () => {
    expect.hasAssertions();
    try {
      validateConfig({
        stylesheets: [
          'https://www.mapbox.com/chunk-lite.css',
          path.join(__dirname, 'src/pages/**/*.css'),
          path.join(__dirname, 'does-not-exist.css')
        ]
      });
    } catch (error) {
      expect(error instanceof errorTypes.ConfigValidationError).toBe(true);
      expect(error.messages.length).toBe(1);
      expect(stripAnsi(error.messages[0])).toMatch(
        'does-not-exist.css does not point to an existing file'
      );
    }
  });
});
