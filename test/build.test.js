'use strict';

const stripAnsi = require('strip-ansi');
const build = require('../src/node/build');
const constants = require('../src/node/constants');
const inlineCss = require('../src/node/inline-css');
const generateSitemap = require('../src/node/generate-sitemap');
const compileStylesheets = require('../src/node/compile-stylesheets');
const createWebpackConfigClient = require('../src/node/create-webpack-config-client');
const createWebpackConfigStatic = require('../src/node/create-webpack-config-static');
const maybeClearOutputDirectory = require('../src/node/maybe-clear-output-directory');
const copyNonPageFiles = require('../src/node/copy-non-page-files');
const writeWebpackStats = require('../src/node/write-webpack-stats');
const buildHtml = require('../src/node/build-html');
const webpackCompilePromise = require('../src/node/webpack-compile-promise');
const validateConfig = require('../src/node/validate-config');

jest.mock('../src/node/inline-css', () => {
  const mockEmitter = {
    on: jest.fn()
  };
  const fn = jest.fn(() => mockEmitter);
  fn.mockEmitter = mockEmitter;
  return fn;
});

jest.mock('../src/node/generate-sitemap', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/compile-stylesheets', () => {
  return jest.fn(() => Promise.resolve('mock-stylesheet.css'));
});

jest.mock('../src/node/create-webpack-config-client', () => {
  return jest.fn(() => Promise.resolve({ mockConfigClient: true }));
});

jest.mock('../src/node/create-webpack-config-static', () => {
  return jest.fn(() => Promise.resolve({ mockConfigStatic: true }));
});

jest.mock('../src/node/maybe-clear-output-directory', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/copy-non-page-files', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/write-webpack-stats', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/build-html', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/webpack-compile-promise', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../src/node/validate-config', () => {
  const fn = jest.fn(() => fn.mockValidatedConfig);
  fn.mockValidatedConfig = {};
  return fn;
});

describe('build', () => {
  beforeEach(() => {
    validateConfig.mockValidatedConfig = {
      outputDirectory: '/mock/output',
      publicAssetsPath: 'assets',
      production: true,
      siteOrigin: 'https://www.mapbox.com',
      verbose: false,
      staticHtmlInlineDeferCss: true,
      sitemap: true
    };
  });

  test('validates the config after setting production: true', () => {
    const rawConfig = {
      foo: 'bar'
    };
    const emitter = build(rawConfig, 'project-directory');
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(validateConfig).toHaveBeenCalledWith(
      {
        foo: 'bar',
        production: true
      },
      'project-directory'
    );
  });

  test('does not set production: true if production is not undefined', () => {
    const rawConfig = {
      foo: 'bar',
      production: false
    };
    const emitter = build(rawConfig, 'project-directory');
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(validateConfig).toHaveBeenCalledWith(
      {
        foo: 'bar',
        production: false
      },
      'project-directory'
    );
  });

  test('creates client webpack config with custom publicAssetsPath', done => {
    validateConfig.mockValidatedConfig = {
      outputDirectory: '/mock/output',
      publicAssetsPath: 'site_assets'
    };
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(createWebpackConfigClient).toHaveBeenCalledTimes(1);
      expect(createWebpackConfigClient).toHaveBeenCalledWith({
        outputDirectory: '/mock/output/site_assets',
        publicAssetsPath: 'site_assets'
      });
      done();
    });
  });

  test('creates static webpack config with custom publicAssetsPath', done => {
    validateConfig.mockValidatedConfig = {
      outputDirectory: '/mock/output',
      publicAssetsPath: 'site_assets'
    };
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(createWebpackConfigStatic).toHaveBeenCalledTimes(1);
      expect(createWebpackConfigStatic).toHaveBeenCalledWith({
        outputDirectory: '/mock/output/site_assets',
        publicAssetsPath: 'site_assets'
      });
      done();
    });
  });

  test('catches errors while validating config', done => {
    const expectedError = new Error();
    validateConfig.mockImplementationOnce(() => {
      throw expectedError;
    });
    const emitter = build({ badProperty: true });
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('maybe clears the output directory', () => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    expect(maybeClearOutputDirectory).toHaveBeenCalledWith(
      validateConfig.mockValidatedConfig
    );
  });

  test('compiles stylesheets if there are some', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(compileStylesheets).toHaveBeenCalledTimes(1);
      expect(compileStylesheets).toHaveBeenCalledWith(
        validateConfig.mockValidatedConfig,
        '/mock/output/assets'
      );
      done();
    });
  });

  test('does not compile stylesheets if there are none', done => {
    validateConfig.mockValidatedConfig.stylesheets = [];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(compileStylesheets).not.toHaveBeenCalled();
      done();
    });
  });

  test('catches errors when compiling stylesheets', done => {
    const expectedError = new Error();
    compileStylesheets.mockReturnValueOnce(Promise.reject(expectedError));
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('creates client webpack config', done => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(createWebpackConfigClient).toHaveBeenCalledTimes(1);
      expect(createWebpackConfigClient).toHaveBeenCalledWith(
        Object.assign({}, validateConfig.mockValidatedConfig, {
          outputDirectory: '/mock/output/assets',
          production: true
        })
      );
      done();
    });
  });

  test('catches errors when creating client webpack config', done => {
    const expectedError = new Error();
    createWebpackConfigClient.mockReturnValueOnce(
      Promise.reject(expectedError)
    );
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('runs client webpack process', done => {
    const webpackConfig = {};
    createWebpackConfigClient.mockReturnValueOnce(
      Promise.resolve(webpackConfig)
    );
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(webpackCompilePromise).toHaveBeenCalledWith(webpackConfig);
      done();
    });
  });

  test('catches errors when running client webpack process', done => {
    const expectedError = new Error();
    webpackCompilePromise.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('writes stats from client webpack process', done => {
    const stats = {};
    webpackCompilePromise.mockReturnValueOnce(Promise.resolve(stats));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(writeWebpackStats).toHaveBeenCalledWith('/mock/output', stats);
      done();
    });
  });

  test('catches errors when writing stats', done => {
    const expectedError = new Error();
    writeWebpackStats.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('creates static webpack config', done => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(createWebpackConfigStatic).toHaveBeenCalledTimes(1);
      expect(createWebpackConfigStatic).toHaveBeenCalledWith(
        Object.assign({}, validateConfig.mockValidatedConfig, {
          outputDirectory: '/mock/output/assets',
          production: true
        })
      );
      done();
    });
  });

  test('catches errors when creating static webpack config', done => {
    const expectedError = new Error();
    createWebpackConfigStatic.mockReturnValueOnce(
      Promise.reject(expectedError)
    );
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('runs static webpack process', done => {
    const webpackConfig = {};
    createWebpackConfigStatic.mockReturnValueOnce(
      Promise.resolve(webpackConfig)
    );
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(webpackCompilePromise).toHaveBeenCalledWith(webpackConfig);
      done();
    });
  });

  test('catches errors when running static webpack process', done => {
    const expectedError = new Error();
    webpackCompilePromise.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('copies non-page files', done => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(copyNonPageFiles).toHaveBeenCalledTimes(1);
      expect(copyNonPageFiles).toHaveBeenCalledWith(
        validateConfig.mockValidatedConfig
      );
      done();
    });
  });

  test('catches errors when copying non-page files', done => {
    const expectedError = new Error();
    copyNonPageFiles.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('renders HTML', done => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(buildHtml).toHaveBeenCalledTimes(1);
      expect(buildHtml).toHaveBeenCalledWith(
        validateConfig.mockValidatedConfig,
        undefined
      );
      done();
    });
  });

  test('renders HTML with CSS', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(buildHtml).toHaveBeenCalledTimes(1);
      expect(buildHtml).toHaveBeenCalledWith(
        validateConfig.mockValidatedConfig,
        'mock-stylesheet.css'
      );
      done();
    });
  });

  test('catches errors when rendering HTML', done => {
    const expectedError = new Error();
    buildHtml.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('if there are no stylesheets, skip CSS inlining', done => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(inlineCss).not.toHaveBeenCalled();
      done();
    });
  });

  test('if staticHtmlInlineDeferCss is false, skip CSS inlining', done => {
    validateConfig.mockValidatedConfig.staticHtmlInlineDeferCss = false;
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(inlineCss).not.toHaveBeenCalled();
      done();
    });
  });

  test('if there are stylesheets but production option is not true, skip CSS inlining', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    validateConfig.mockValidatedConfig.production = false;
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(inlineCss).not.toHaveBeenCalled();
      done();
    });
  });

  test('if there are stylesheets and production is true, inline CSS', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(inlineCss).toHaveBeenCalledWith(
        '/mock/output',
        'mock-stylesheet.css',
        {
          verbose: false
        }
      );
      done();
    });
  });

  test('catches errors while inlining CSS', done => {
    const expectedError = new Error();
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
    process.nextTick(() => {
      const errorHandler = inlineCss.mockEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_ERROR
      )[1];
      errorHandler(expectedError);
    });
  });

  test('handles notifications while inlining CSS', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      const notificationHandler = inlineCss.mockEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_NOTIFICATION
      )[1];
      emitter.on(constants.EVENT_NOTIFICATION, message => {
        expect(message).toBe('xyz');
        done();
      });
      notificationHandler('xyz');
    });
  });

  test('does not finish until the inlining CSS fires its done event', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    let buildDone = false;
    emitter.on(constants.EVENT_DONE, () => {
      buildDone = true;
      done();
    });
    process.nextTick(() => {
      const doneHandler = inlineCss.mockEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_DONE
      )[1];
      expect(buildDone).toBe(false);
      doneHandler();
    });
  });

  test('if no CSS is inlined, build can complete', done => {
    validateConfig.mockValidatedConfig.stylesheets = [];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_DONE, () => {
      done();
    });
  });

  test('if config includes siteOrigin, creates a sitemap', done => {
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(generateSitemap).toHaveBeenCalledWith(
        validateConfig.mockValidatedConfig
      );
      done();
    });
  });

  test('handles errors creating a sitemap', done => {
    const expectedError = new Error();
    generateSitemap.mockReturnValueOnce(Promise.reject(expectedError));
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, error => {
      expect(error).toBe(expectedError);
      done();
    });
  });

  test('if config does not include siteOrigin, does not create a sitemap and emits a notification', done => {
    validateConfig.mockValidatedConfig.siteOrigin = undefined;
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      if (/unable to generate sitemap/.test(message)) {
        done();
      }
    });
  });

  test('if sitemap option is false, does not create a sitemap', done => {
    validateConfig.mockValidatedConfig.sitemap = false;
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    process.nextTick(() => {
      expect(generateSitemap).not.toHaveBeenCalled();
      done();
    });
  });

  test('order of notifications, without CSS inlining or sitemap', done => {
    delete validateConfig.mockValidatedConfig.siteOrigin;
    const notifications = [];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      notifications.push(stripAnsi(message));
    });
    emitter.on(constants.EVENT_DONE, () => {
      expect(notifications).toMatchSnapshot();
      done();
    });
  });

  test('order of notifications, *with* CSS inlining and sitemap', done => {
    validateConfig.mockValidatedConfig.stylesheets = ['one.css', 'two.css'];
    const notifications = [];
    const emitter = build();
    emitter.on(constants.EVENT_ERROR, logEmitterError);
    emitter.on(constants.EVENT_NOTIFICATION, message => {
      notifications.push(stripAnsi(message));
    });
    emitter.on(constants.EVENT_DONE, () => {
      expect(notifications).toMatchSnapshot();
      done();
    });
    process.nextTick(() => {
      const cssInliningNotificationHandler = inlineCss.mockEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_NOTIFICATION
      )[1];
      cssInliningNotificationHandler('CSS inlining message 1');
      cssInliningNotificationHandler('CSS inlining message 2');
      const cssInliningDoneHandler = inlineCss.mockEmitter.on.mock.calls.find(
        call => call[0] === constants.EVENT_DONE
      )[1];
      cssInliningDoneHandler();
    });
  });
});

function logEmitterError(error) {
  console.error(error.stack); // eslint-disable-line no-console
}
