'use strict';

const chokidar = require('chokidar');
const writeContextModule = require('../src/node/write-context-module');
const watchContext = require('../src/node/watch-context');

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

jest.mock('../src/node/write-context-module', () => {
  return jest.fn(() => Promise.resolve('mock/context.js'));
});

describe('watchContext', () => {
  let onError;
  let afterCompilation;

  beforeEach(() => {
    onError = jest.fn();
    afterCompilation = jest.fn();
  });

  test('creates a watcher', () => {
    watchContext(
      { pagesDirectory: 'src/pages/' },
      { onError, afterCompilation }
    );
    expect(chokidar.watch).toHaveBeenCalledWith('**/*.{js,md}', {
      ignoreInitial: true,
      cwd: 'src/pages/'
    });
  });

  test('handles errors', () => {
    watchContext(
      { pagesDirectory: 'src/pages/' },
      { onError, afterCompilation }
    );
    expect(chokidar.watcher.on).toHaveBeenCalledWith('error', onError);
  });

  test('rebuilds the context module on change events', () => {
    const batfishConfig = { pagesDirectory: 'src/pages/' };
    watchContext(batfishConfig, { onError, afterCompilation });
    expect(chokidar.watcher.on.mock.calls[0][0]).toBe('change');
    // Manually trigger a change event.
    chokidar.watcher.on.mock.calls[0][1]();
    expect(writeContextModule).toHaveBeenCalledWith(batfishConfig);
    return Promise.resolve().then(() => {
      expect(afterCompilation).toHaveBeenCalled();
    });
  });

  test('rebuilds the context module on unlink events', () => {
    const batfishConfig = { pagesDirectory: 'src/pages/' };
    watchContext(batfishConfig, { onError, afterCompilation });
    expect(chokidar.watcher.on.mock.calls[1][0]).toBe('unlink');
    // Manually trigger a change event.
    chokidar.watcher.on.mock.calls[1][1]();
    expect(writeContextModule).toHaveBeenCalledWith(batfishConfig);
    return Promise.resolve().then(() => {
      expect(afterCompilation).toHaveBeenCalled();
    });
  });

  test('rebuilds the context module on add events', () => {
    const batfishConfig = { pagesDirectory: 'src/pages/' };
    watchContext(batfishConfig, { onError, afterCompilation });
    expect(chokidar.watcher.on.mock.calls[2][0]).toBe('add');
    // Manually trigger a change event.
    chokidar.watcher.on.mock.calls[2][1]();
    expect(writeContextModule).toHaveBeenCalledWith(batfishConfig);
    return Promise.resolve().then(() => {
      expect(afterCompilation).toHaveBeenCalled();
    });
  });

  test('handles errors writing the context module', () => {
    const batfishConfig = { pagesDirectory: 'src/pages/' };
    watchContext(batfishConfig, { onError, afterCompilation });
    expect(chokidar.watcher.on.mock.calls[0][0]).toBe('change');
    // Set up the error.
    const error = new Error();
    writeContextModule.mockReturnValue(Promise.reject(error));
    // Manually trigger a change event.
    chokidar.watcher.on.mock.calls[0][1]();
    expect(writeContextModule).toHaveBeenCalledWith(batfishConfig);
    return new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
      expect(afterCompilation).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});
