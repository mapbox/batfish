'use strict';

const scrollRestorer = require('@mapbox/scroll-restorer');
const changePage = require('../src/webpack/change-page').changePage;
const findMatchingRouteModule = require('../src/webpack/find-matching-route');
const scrollToFragment = require('../src/webpack/scroll-to-fragment')
  .scrollToFragment;
/* eslint-disable node/no-missing-require */
const _invokeRouteChangeStartCallbacks = require('@mapbox/batfish/modules/route-change-listeners')
  ._invokeRouteChangeStartCallbacks;
const _invokeRouteChangeEndCallbacks = require('@mapbox/batfish/modules/route-change-listeners')
  ._invokeRouteChangeEndCallbacks;
/* eslint-enable node/no-missing-require */
const getWindowModule = require('../src/webpack/get-window');

jest.mock('../src/webpack/scroll-to-fragment', () => {
  return {
    scrollToFragment: jest.fn()
  };
});

jest.mock('../src/webpack/get-current-location', () => {
  return {
    getCurrentLocation: jest.fn(() => ({
      pathname: '/current/location/',
      hash: '',
      search: ''
    }))
  };
});

jest.mock('../src/webpack/find-matching-route', () => {
  const mock = {};
  mock.mockMatchinRoutePageModule = {
    component: {},
    props: {}
  };
  mock.mockMatchingRoute = {
    path: '/bar/baz/',
    getPage: jest.fn(() => Promise.resolve(mock.mockMatchinRoutePageModule))
  };
  mock.findMatchingRoute = jest.fn(() => mock.mockMatchingRoute);
  return mock;
});

jest.mock(
  '@mapbox/batfish/modules/route-change-listeners',
  () => {
    return {
      _invokeRouteChangeStartCallbacks: jest.fn(() => Promise.resolve()),
      _invokeRouteChangeEndCallbacks: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);

jest.mock('@mapbox/scroll-restorer', () => {
  return {
    start: jest.fn(),
    restoreScroll: jest.fn(),
    getSavedScroll: jest.fn(() => null)
  };
});

describe('changePage', () => {
  let mockWindow;
  let setRouterState;
  let nextLocation;

  beforeEach(() => {
    setRouterState = jest.fn();
    nextLocation = {
      pathname: '/bar/baz/',
      hash: '',
      search: ''
    };
    mockWindow = {
      location: {
        pathname: '/foo/',
        hash: '',
        search: ''
      },
      history: {
        pushState: jest.fn()
      },
      scrollTo: jest.fn()
    };
    jest.spyOn(getWindowModule, 'getWindow').mockReturnValue(mockWindow);
  });

  afterEach(() => {
    getWindowModule.getWindow.mockRestore();
  });

  test('finds the matching route', () => {
    return changePage(nextLocation, setRouterState).then(() => {
      expect(findMatchingRouteModule.findMatchingRoute).toHaveBeenCalledTimes(
        1
      );
      expect(findMatchingRouteModule.findMatchingRoute).toHaveBeenCalledWith(
        '/bar/baz/'
      );
    });
  });

  test('invokes change-start callbacks right away', () => {
    const result = changePage(nextLocation, setRouterState);
    expect(_invokeRouteChangeStartCallbacks).toHaveBeenCalledTimes(1);
    expect(_invokeRouteChangeStartCallbacks).toHaveBeenCalledWith('/bar/baz/');
    expect(_invokeRouteChangeEndCallbacks).toHaveBeenCalledTimes(0);
    return result;
  });

  test('allows change-start callbacks to delay resolution', done => {
    jest.useFakeTimers();
    const wait = new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    _invokeRouteChangeStartCallbacks.mockReturnValue(wait);
    changePage(nextLocation, setRouterState);
    jest.runTimersToTime(400);
    expect(setRouterState).not.toHaveBeenCalled();
    jest.runAllTimers();
    process.nextTick(() => {
      expect(setRouterState).toHaveBeenCalled();
      jest.useRealTimers();
      done();
    });
  });

  test('does not invoke pushState if not instructed to', () => {
    return changePage(nextLocation, setRouterState).then(() => {
      expect(mockWindow.history.pushState).not.toHaveBeenCalled();
    });
  });

  test('invokes pushState if instructed to', () => {
    return changePage(nextLocation, setRouterState, {
      pushState: true
    }).then(() => {
      expect(mockWindow.history.pushState).toHaveBeenCalledWith(
        {},
        null,
        '/bar/baz/'
      );
    });
  });

  test('invokes setRouterState', () => {
    return changePage(nextLocation, setRouterState).then(() => {
      expect(setRouterState).toHaveBeenCalledWith(
        {
          path: '/bar/baz/',
          PageComponent:
            findMatchingRouteModule.mockMatchinRoutePageModule.component,
          pageProps: findMatchingRouteModule.mockMatchinRoutePageModule.props,
          location: {
            pathname: '/current/location/',
            hash: '',
            search: ''
          }
        },
        expect.any(Function)
      );
    });
  });

  test('setRouterState callback does not scroll to top unless instructed to', () => {
    return changePage(nextLocation, setRouterState).then(() => {
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(mockWindow.scrollTo).not.toHaveBeenCalled();
      expect(scrollRestorer.restoreScroll).not.toHaveBeenCalled();
    });
  });

  test('setRouterState callback does scroll to top if instructed to', () => {
    return changePage(nextLocation, setRouterState, {
      scrollToTop: true
    }).then(() => {
      expect(mockWindow.scrollTo).not.toHaveBeenCalled();
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(mockWindow.scrollTo).toHaveBeenCalledWith(0, 0);
      expect(scrollRestorer.restoreScroll).not.toHaveBeenCalled();
    });
  });

  test('setRouterState callback restores saved scroll', () => {
    scrollRestorer.getSavedScroll.mockReturnValue({});
    return changePage(nextLocation, setRouterState).then(() => {
      expect(scrollRestorer.restoreScroll).not.toHaveBeenCalled();
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(mockWindow.scrollTo).not.toHaveBeenCalled();
      expect(scrollRestorer.restoreScroll).toHaveBeenCalled();
    });
  });

  test('setRouterState scrolls to fragment if there is a hash', () => {
    nextLocation = {
      hash: '#foo'
    };
    scrollRestorer.getSavedScroll.mockReturnValue({});
    return changePage(nextLocation, setRouterState).then(() => {
      expect(scrollRestorer.restoreScroll).not.toHaveBeenCalled();
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(mockWindow.scrollTo).not.toHaveBeenCalled();
      expect(scrollRestorer.restoreScroll).not.toHaveBeenCalled();
    });
  });

  test('setRouterState callback does not restore scroll if none is saved', () => {
    scrollRestorer.getSavedScroll.mockReturnValue(null);
    return changePage(nextLocation, setRouterState).then(() => {
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(mockWindow.scrollTo).not.toHaveBeenCalled();
      expect(scrollRestorer.restoreScroll).not.toHaveBeenCalled();
      expect(scrollToFragment).not.toHaveBeenCalled();
    });
  });

  test('setRouterState callback invokes change-end callbacks', () => {
    return changePage(nextLocation, setRouterState).then(() => {
      expect(_invokeRouteChangeEndCallbacks).not.toHaveBeenCalled();
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(_invokeRouteChangeEndCallbacks).toHaveBeenCalledWith('/bar/baz/');
    });
  });

  test('setRouterState callback invokes onFinish callback', () => {
    const onFinish = jest.fn();
    return changePage(nextLocation, setRouterState, {}, onFinish).then(() => {
      expect(onFinish).not.toHaveBeenCalled();
      const callback = setRouterState.mock.calls[0][1];
      callback();
      expect(onFinish).toHaveBeenCalledWith();
    });
  });
});
