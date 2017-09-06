/**
 * @jest-environment jsdom
 */
/* eslint-disable node/no-missing-require */
/* globals window */
'use strict';

const React = require('react');
const shallow = require('enzyme').shallow;
const mount = require('enzyme').mount;
const toJson = require('enzyme-to-json').default;
const Router = require('../src/webpack/router').Router;
const routeTo = require('@mapbox/batfish/modules/route-to').routeTo;
const _invokeRouteChangeStartCallbacks = require('@mapbox/batfish/modules/route-change-listeners')
  ._invokeRouteChangeStartCallbacks;
const _invokeRouteChangeEndCallbacks = require('@mapbox/batfish/modules/route-change-listeners')
  ._invokeRouteChangeEndCallbacks;
const scrollRestorer = require('@mapbox/scroll-restorer');
const linkHijacker = require('@mapbox/link-hijacker');
const linkToLocation = require('@mapbox/link-to-location');
const findMatchingRoute = require('../src/webpack/find-matching-route')
  .findMatchingRoute;

jest.mock('../src/webpack/find-matching-route', () => {
  return {
    findMatchingRoute: jest.fn()
  };
});

jest.mock(
  '@mapbox/batfish/modules/route-to',
  () => {
    const routeTo = jest.fn();
    routeTo._setRouteToHandler = jest.fn();
    return { routeTo };
  },
  { virtual: true }
);

jest.mock(
  '@mapbox/batfish/modules/prefix-url',
  () => {
    const prefixUrl = jest.fn();
    prefixUrl._configure = jest.fn();
    return { prefixUrl };
  },
  { virtual: true }
);

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

jest.mock(
  'batfish-internal/context',
  () => {
    return {
      batfishContext: {
        selectedConfig: {
          siteBasePath: 'mockSiteBasePath',
          siteOrigin: 'mockSiteOrigin',
          hijackLinks: true
        }
      }
    };
  },
  { virtual: true }
);

jest.mock('@mapbox/scroll-restorer', () => {
  return {
    start: jest.fn(),
    restoreScroll: jest.fn(),
    getSavedScroll: jest.fn()
  };
});

jest.mock('@mapbox/link-hijacker', () => {
  return {
    hijack: jest.fn()
  };
});

jest.mock('@mapbox/link-to-location', () => {
  return jest.fn();
});

describe('Router', () => {
  function StartingComponent() {
    return <div>magic</div>;
  }
  const pageProps = { isMagic: true };

  beforeEach(() => {
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/magic/'
    });
    Object.defineProperty(window.location, 'search', {
      writable: true,
      value: ''
    });
    Object.defineProperty(window.location, 'hash', {
      writable: true,
      value: ''
    });
    Object.defineProperty(window.location, 'assign', {
      writable: true,
      value: jest.fn()
    });
  });

  test('renders the initial page', () => {
    const wrapper = shallow(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('on mount, starts the scroll restorer and tries to restore prior scroll', () => {
    mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(scrollRestorer.start).toHaveBeenCalledTimes(1);
    expect(scrollRestorer.start).toHaveBeenCalledWith({ autoRestore: false });
    expect(scrollRestorer.restoreScroll).toHaveBeenCalledTimes(1);
  });

  test('on mount, sets the route handler for routeTo', () => {
    const wrapper = mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(routeTo._setRouteToHandler).toHaveBeenCalledTimes(1);
    expect(routeTo._setRouteToHandler).toHaveBeenCalledWith(
      wrapper.instance().routeTo
    );
  });

  test('on mount, initializes link hijacking', () => {
    const wrapper = mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(linkHijacker.hijack).toHaveBeenCalledTimes(1);
    expect(linkHijacker.hijack.mock.calls[0][0]).toHaveProperty('skipFilter');
    expect(linkHijacker.hijack.mock.calls[0][1]).toBe(
      wrapper.instance().routeTo
    );
  });

  test('on mount, adds a popstate listener that changes pages', () => {
    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      value: jest.fn()
    });
    const wrapper = mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    expect(window.addEventListener.mock.calls[0][0]).toBe('popstate');

    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/magic/'
    });
    Object.defineProperty(window.location, 'search', {
      writable: true,
      value: '?foo=bar'
    });
    Object.defineProperty(window.location, 'hash', {
      writable: true,
      value: '#baz'
    });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'changePage').mockImplementation(() => {});
    const mockEvent = {
      preventDefault: jest.fn()
    };
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(0);
    expect(instance.changePage).toHaveBeenCalledTimes(0);
    window.addEventListener.mock.calls[0][1](mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.changePage).toHaveBeenCalledTimes(1);
    expect(instance.changePage).toHaveBeenCalledWith({
      hash: '#baz',
      pathname: '/magic/',
      search: '?foo=bar'
    });
  });

  test('on mount, resets the location state to capture hash and search', () => {
    const wrapper = shallow(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(wrapper.find('StartingComponent').props().location).toEqual({
      pathname: '/magic/',
      search: '',
      hash: ''
    });

    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/magic/'
    });
    Object.defineProperty(window.location, 'search', {
      writable: true,
      value: '?foo=bar'
    });
    Object.defineProperty(window.location, 'hash', {
      writable: true,
      value: '#baz'
    });
    wrapper.instance().componentDidMount();
    wrapper.update();
    expect(wrapper.find('StartingComponent').props().location).toEqual({
      pathname: '/magic/',
      search: '?foo=bar',
      hash: '#baz'
    });
  });

  test('instance.routeTo changes pages programmatically for Batfish-matching routes', () => {
    const wrapper = mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    linkToLocation.mockReturnValue({ pathname: '/horse/' });
    findMatchingRoute.mockReturnValue({});
    const instance = wrapper.instance();
    instance.changePage = jest.fn();
    instance.routeTo('foo');
    expect(instance.changePage).toHaveBeenCalledTimes(1);
    expect(instance.changePage).toHaveBeenCalledWith(
      { pathname: '/horse/' },
      {
        pushState: true,
        scrollToTop: true
      }
    );
  });

  test('instance.routeTo does not reset scroll after changing pages if pathname has not changed and there is a hash in the next URL', () => {
    const wrapper = mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    linkToLocation.mockReturnValue({ pathname: '/magic/', hash: '#dog' });
    findMatchingRoute.mockReturnValue({});
    const instance = wrapper.instance();
    instance.changePage = jest.fn();
    instance.routeTo('foo');
    expect(instance.changePage).toHaveBeenCalledTimes(1);
    expect(instance.changePage).toHaveBeenCalledWith(
      { pathname: '/magic/', hash: '#dog' },
      {
        pushState: true,
        scrollToTop: false
      }
    );
  });

  test('instance.routeTo redirects for non-Batfish-matching pages', () => {
    const wrapper = mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    linkToLocation.mockReturnValue({ pathname: '/not/known/page' });
    findMatchingRoute.mockReturnValue({ is404: true });
    const instance = wrapper.instance();
    instance.changePage = jest.fn();
    instance.routeTo('/not/known/page');
    expect(instance.changePage).toHaveBeenCalledTimes(0);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith('/not/known/page');
  });

  test.only(
    'instance.changePage invokes change-start and change-end callbacks',
    () => {
      const wrapper = shallow(
        React.createElement(Router, {
          startingPath: '/magic/',
          startingComponent: StartingComponent,
          pageProps: pageProps
        })
      );
      const instance = wrapper.instance();
      const mockPageModule = {
        component: function Mockery() {
          return <div>mockery</div>;
        },
        props: {}
      };
      const mockRoute = {
        getPage: () => Promise.resolve(mockPageModule),
        path: '/mock/route/'
      };
      const mockNextLocation = {
        pathname: '/mock/route/',
        hash: '#foo'
      };
      findMatchingRoute.mockImplementation(pathname => {
        if (pathname === mockNextLocation.pathname) {
          return mockRoute;
        } else {
          throw new Error(`Oops. Unknown pathname ${pathname}`);
        }
      });
      const changer = instance.changePage(mockNextLocation);
      expect(findMatchingRoute).toHaveBeenCalledTimes(1);
      expect(findMatchingRoute).toHaveBeenCalledWith(mockNextLocation.pathname);
      expect(_invokeRouteChangeStartCallbacks).toHaveBeenCalledTimes(1);
      expect(_invokeRouteChangeStartCallbacks).toHaveBeenCalledWith(
        mockNextLocation.pathname
      );
      expect(_invokeRouteChangeEndCallbacks).toHaveBeenCalledTimes(0);
      wrapper.update();
      return changer.then(() => {
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(_invokeRouteChangeEndCallbacks).toHaveBeenCalledTimes(1);
        expect(_invokeRouteChangeEndCallbacks).toHaveBeenCalledWith(
          mockNextLocation.pathname
        );
      });
    }
  );
});
