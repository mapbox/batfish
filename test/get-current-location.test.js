'use strict';

const getCurrentLocation =
  require('../src/webpack/get-current-location').getCurrentLocation;
const getWindowModule = require('../src/webpack/get-window');

describe('getCurrentLocation', () => {
  let mockWindow;
  beforeEach(() => {
    mockWindow = {
      location: {
        pathname: '/foo/',
        hash: '',
        search: ''
      }
    };
    jest.spyOn(getWindowModule, 'getWindow').mockReturnValue(mockWindow);
  });

  afterEach(() => {
    getWindowModule.getWindow.mockRestore();
  });

  test('returns the pathname', () => {
    expect(getCurrentLocation()).toEqual({
      pathname: '/foo/',
      hash: '',
      search: ''
    });
  });

  test('returns all the things', () => {
    mockWindow.location = {
      pathname: '/bar/',
      hash: '#pig',
      search: '?horse=apocalypse',
      extra: 8
    };
    expect(getCurrentLocation()).toEqual({
      pathname: '/bar/',
      hash: '#pig',
      search: '?horse=apocalypse'
    });
  });

  test('adds a trailing slash to the pathname', () => {
    mockWindow.location.pathname = '/foo/bar/baz';
    expect(getCurrentLocation()).toEqual({
      pathname: '/foo/bar/baz/',
      hash: '',
      search: ''
    });
  });
});
