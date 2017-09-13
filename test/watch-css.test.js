'use strict';

const chokidar = require('chokidar');
const compileStylesheets = require('../src/node/compile-stylesheets');
const watchCss = require('../src/node/watch-css');

jest.mock('chokidar', () => {
  const watcher = {
    on: jest.fn()
  };
  return {
    watch: jest.fn(() => watcher),
    // Just for testing.
    watcher
  };
});

jest.mock('../src/node/compile-stylesheets', () => {
  return jest.fn(() => Promise.resolve('mock/compiled.css'));
});

describe('watchCss', () => {
  let onError;
  let afterCompilation;

  beforeEach(() => {
    onError = jest.fn();
    afterCompilation = jest.fn();
  });

  test('does nothing if there are no stylesheets', () => {
    watchCss({ stylesheets: [] }, { onError, afterCompilation });
    expect(chokidar.watch).not.toHaveBeenCalled();
  });

  test('creates a watcher', () => {
    watchCss(
      { stylesheets: ['foo.css', 'bar.css'] },
      { onError, afterCompilation }
    );
    expect(chokidar.watch).toHaveBeenCalledWith(['foo.css', 'bar.css']);
  });

  test('handles errors', () => {
    watchCss(
      { stylesheets: ['foo.css', 'bar.css'] },
      { onError, afterCompilation }
    );
    expect(chokidar.watcher.on).toHaveBeenCalledWith('error', onError);
  });

  test('handles change events', () => {
    const batfishConfig = { stylesheets: ['foo.css', 'bar.css'] };
    watchCss(batfishConfig, { onError, afterCompilation });
    expect(chokidar.watcher.on.mock.calls[0][0]).toBe('change');
    // Manually trigger a change event.
    chokidar.watcher.on.mock.calls[0][1]();
    expect(compileStylesheets).toHaveBeenCalledWith(batfishConfig);
    return Promise.resolve(() => {
      expect(afterCompilation).toHaveBeenCalledWith('mock/compiled.css');
    });
  });

  test('handles CSS compilation errors', () => {
    const batfishConfig = { stylesheets: ['foo.css', 'bar.css'] };
    watchCss(batfishConfig, { onError, afterCompilation });
    expect(chokidar.watcher.on.mock.calls[0][0]).toBe('change');
    // Set up the error
    const error = new Error();
    compileStylesheets.mockReturnValue(Promise.reject(error));
    // Manually trigger a change event.
    chokidar.watcher.on.mock.calls[0][1]();
    return Promise.resolve(() => {
      expect(afterCompilation).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});
