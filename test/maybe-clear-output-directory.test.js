'use strict';

const del = require('del');
const maybeClearOutputDirectory = require('../src/node/maybe-clear-output-directory');

jest.mock('del', () => {
  return jest.fn(() => Promise.resolve());
});

describe('maybeClearOutputDirectory', () => {
  test('clears the output directory', () => {
    return maybeClearOutputDirectory({
      clearOutputDirectory: true,
      outputDirectory: 'mock/output/directory/',
    }).then(() => {
      expect(del).toHaveBeenCalledWith('mock/output/directory/', {
        force: true,
      });
    });
  });

  test('does not clear the output directory, but still returns a Promise', () => {
    return maybeClearOutputDirectory({
      clearOutputDirectory: false,
      outputDirectory: 'mock/output/directory/',
    }).then(() => {
      expect(del).not.toHaveBeenCalled();
    });
  });
});
