/**
 * @jest-environment jsdom
 */
/* eslint-disable node/no-missing-require */
'use strict';

const React = require('react');
const shallow = require('enzyme').shallow;
const mount = require('enzyme').mount;
const toJson = require('enzyme-to-json').default;
const Router = require('../src/webpack/router').Router;
const routeTo = require('@mapbox/batfish/modules/route-to').routeTo;
const scrollRestorer = require('@mapbox/scroll-restorer');
const linkHijacker = require('@mapbox/link-hijacker');
const linkToLocation = require('@mapbox/link-to-location');
const getWindowModule = require('../src/webpack/get-window');
const changePage = require('../src/webpack/change-page').changePage;
const findMatchingRoute = require('../src/webpack/find-matching-route')
  .findMatchingRoute;

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

jest.mock('../src/webpack/change-page', () => {
  return {
    changePage: jest.fn()
  };
});

jest.mock('../src/webpack/find-matching-route', () => {
  return {
    findMatchingRoute: jest.fn()
  };
});

describe('Router', () => {
  let StartingComponent;
  let pageProps;
  let mockWindow;
  beforeEach(() => {
    StartingComponent = function StartingComponent() {
      return <div>magic</div>;
    };
    pageProps = { isMagic: true };
    mockWindow = {
      location: {
        pathname: '/magic/',
        hash: '',
        search: '',
        assign: jest.fn()
      },
      addEventListener: jest.fn()
    };
    jest.spyOn(getWindowModule, 'getWindow').mockReturnValue(mockWindow);
  });

  afterEach(() => {
    getWindowModule.getWindow.mockRestore();
  });

  test('renders the initial page without a window', () => {
    const wrapper = shallow(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders the initial page with a window passes current location details', () => {
    mockWindow.location.search = '?foo=bar';
    mockWindow.location.hash = '#grr';
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
  //
  test('on mount, adds a popstate listener that changes pages', () => {
    mount(
      React.createElement(Router, {
        startingPath: '/magic/',
        startingComponent: StartingComponent,
        pageProps: pageProps
      })
    );
    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(1);
    expect(mockWindow.addEventListener.mock.calls[0][0]).toBe('popstate');

    mockWindow.location = {
      pathname: '/magic/',
      search: '?foo=bar',
      hash: '#baz'
    };
    const mockEvent = {
      preventDefault: jest.fn()
    };
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(changePage).not.toHaveBeenCalled();
    mockWindow.addEventListener.mock.calls[0][1](mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(changePage).toHaveBeenCalledTimes(1);
    expect(changePage).toHaveBeenCalledWith(
      {
        hash: '#baz',
        pathname: '/magic/',
        search: '?foo=bar'
      },
      expect.any(Function)
    );
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

    mockWindow.location = {
      pathname: '/magic/',
      search: '?foo=bar',
      hash: '#baz'
    };
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
    instance.routeTo('foo');
    expect(changePage).toHaveBeenCalledTimes(1);
    expect(changePage).toHaveBeenCalledWith(
      { pathname: '/horse/' },
      expect.any(Function),
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
    instance.routeTo('foo');
    expect(changePage).toHaveBeenCalledTimes(1);
    expect(changePage).toHaveBeenCalledWith(
      { pathname: '/magic/', hash: '#dog' },
      expect.any(Function),
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
    instance.routeTo('/not/known/page');
    expect(changePage).not.toHaveBeenCalled();
    expect(mockWindow.location.assign).toHaveBeenCalledTimes(1);
    expect(mockWindow.location.assign).toHaveBeenCalledWith('/not/known/page');
  });
});
