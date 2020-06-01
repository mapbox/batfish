'use strict';

const cpy = require('cpy');
const nonPageFiles = require('../src/node/non-page-files');

jest.mock('cpy', () => {
  return jest.fn(() => Promise.resolve());
});

describe('nonPageFiles.copy', () => {
  test('copies files that are not .js or .md', () => {
    return nonPageFiles
      .copy({
        outputDirectory: 'mockOutputDirectory',
        pagesDirectory: 'mockPagesDirectory'
      })
      .then(() => {
        expect(cpy).toHaveBeenCalledTimes(1);
        expect(cpy).toHaveBeenCalledWith(
          ['**/*.*', '!**/*.js', '!**/*.md'],
          'mockOutputDirectory',
          {
            cwd: 'mockPagesDirectory',
            parents: true
          }
        );
      });
  });

  test('copies files designated by unprocessedPageFiles option', () => {
    return nonPageFiles
      .copy({
        outputDirectory: 'mockOutputDirectory',
        pagesDirectory: 'mockPagesDirectory',
        unprocessedPageFiles: ['**/home.js', '**/horse.md']
      })
      .then(() => {
        expect(cpy).toHaveBeenCalledTimes(1);
        expect(cpy).toHaveBeenCalledWith(
          ['**/*.*', '!**/*.js', '!**/*.md', '**/home.js', '**/horse.md'],
          'mockOutputDirectory',
          {
            cwd: 'mockPagesDirectory',
            parents: true
          }
        );
      });
  });

  test('ignores files designated by ignoreWithinPagesDirectory option', () => {
    return nonPageFiles
      .copy({
        outputDirectory: 'mockOutputDirectory',
        pagesDirectory: 'mockPagesDirectory',
        ignoreWithinPagesDirectory: ['**/*.txt', '*.xyz']
      })
      .then(() => {
        expect(cpy).toHaveBeenCalledTimes(1);
        expect(cpy).toHaveBeenCalledWith(
          ['**/*.*', '!**/*.js', '!**/*.md', '!**/*.txt', '!*.xyz'],
          'mockOutputDirectory',
          {
            cwd: 'mockPagesDirectory',
            parents: true
          }
        );
      });
  });

  test('ignores unprocessedPageFiles files designated by ignoreWithinPagesDirectory option', () => {
    return nonPageFiles
      .copy({
        outputDirectory: 'mockOutputDirectory',
        pagesDirectory: 'mockPagesDirectory',
        unprocessedPageFiles: ['**/home.js', '**/horse.md'],
        ignoreWithinPagesDirectory: ['**/*.js', '*.xyz']
      })
      .then(() => {
        expect(cpy).toHaveBeenCalledTimes(1);
        expect(cpy).toHaveBeenCalledWith(
          [
            '**/*.*',
            '!**/*.js',
            '!**/*.md',
            '**/home.js',
            '**/horse.md',
            '!**/*.js',
            '!*.xyz'
          ],
          'mockOutputDirectory',
          {
            cwd: 'mockPagesDirectory',
            parents: true
          }
        );
      });
  });
});
