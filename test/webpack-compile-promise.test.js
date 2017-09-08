'use strict';

const webpack = require('webpack');
const webpackCompilePromise = require('../src/node/webpack-compile-promise');
const errorTypes = require('../src/node/error-types');

jest.mock('webpack', () => {
  const compiler = {
    run: jest.fn()
  };
  const mockWebpack = jest.fn(() => compiler);
  mockWebpack.compiler = compiler;
  return mockWebpack;
});

describe('webpackCompilePromise', () => {
  test('creates a Wepback compiler', () => {
    const webpackConfig = {};
    webpackCompilePromise(webpackConfig);
    expect(webpack).toHaveBeenCalledTimes(1);
    expect(webpack).toHaveBeenCalledWith(webpackConfig);
  });

  test('catches errors while creating the Wepback compiler', () => {
    const expectedError = new Error();
    webpack.mockImplementationOnce(() => {
      throw expectedError;
    });
    return webpackCompilePromise({}).then(
      () => {
        throw new Error('should have errored');
      },
      error => {
        expect(error).toBeInstanceOf(errorTypes.WebpackFatalError);
        expect(error.originalError).toBe(expectedError);
      }
    );
  });

  test('runs the compiler', () => {
    webpackCompilePromise({});
    expect(webpack.compiler.run).toHaveBeenCalledTimes(1);
    expect(webpack.compiler.run.mock.calls[0][0]).toBeInstanceOf(Function);
  });

  test('receives stats after a successful run', () => {
    const result = webpackCompilePromise({});
    expect(webpack.compiler.run).toHaveBeenCalledTimes(1);
    const stats = {
      hasErrors: jest.fn(() => false)
    };
    webpack.compiler.run.mock.calls[0][0](null, stats);
    return result.then(resolution => {
      expect(resolution).toBe(stats);
    });
  });

  test('catches errors from run', () => {
    const expectedError = new Error();
    const result = webpackCompilePromise({});
    expect(webpack.compiler.run).toHaveBeenCalledTimes(1);
    const stats = {
      hasErrors: jest.fn(() => false)
    };
    webpack.compiler.run.mock.calls[0][0](expectedError, stats);
    return result.then(
      () => {
        throw new Error('should have errored');
      },
      error => {
        expect(error).toBeInstanceOf(errorTypes.WebpackFatalError);
        expect(error.originalError).toBe(expectedError);
      }
    );
  });

  test('catches errors in stats', () => {
    const result = webpackCompilePromise({});
    expect(webpack.compiler.run).toHaveBeenCalledTimes(1);
    const stats = {
      hasErrors: jest.fn(() => true)
    };
    webpack.compiler.run.mock.calls[0][0](null, stats);
    return result.then(
      () => {
        throw new Error('should have errored');
      },
      error => {
        expect(error).toBeInstanceOf(errorTypes.WebpackCompilationError);
        expect(error.stats).toBe(stats);
      }
    );
  });
});
