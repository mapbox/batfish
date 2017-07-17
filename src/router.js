'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const linkHijacker = require('@mapbox/link-hijacker');
const scrollRestorer = require('@mapbox/scroll-restorer');
const findMatchingRoute = require('./find-matching-route');
const scrollToFragment = require('./scroll-to-fragment');
const linkToLocation = require('./link-to-location');
const routeTo = require('./route-to');

function getContextLocation() {
  let tidyPath = window.location.pathname;
  if (!/\/$/.test(tidyPath)) tidyPath += '/';
  return {
    pathname: tidyPath,
    hash: window.location.hash,
    search: window.location.search
  };
}

class Router extends React.PureComponent {
  static propTypes = {
    startingPath: PropTypes.string.isRequired,
    startingComponent: PropTypes.func.isRequired,
    startingProps: PropTypes.object.isRequired
  };

  static childContextTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      hash: PropTypes.string,
      search: PropTypes.string
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      path: this.props.startingPath,
      pageComponent: this.props.startingComponent,
      pageProps: this.props.startingProps,
      location: {
        pathname: this.props.startingPath
      }
    };
  }

  getChildContext() {
    return { location: this.state.location };
  }

  componentDidMount() {
    scrollRestorer.start({ autoRestore: false });
    scrollRestorer.restoreScroll();

    // Only on the dev server do we need to scroll to fragments on the initial
    // load. With static HTML pages, the browser should take care of this
    // for us.
    if (process.env.DEV_SERVER) {
      scrollToFragment();
    }

    routeTo.onRouteTo(this.routeTo);
    window.addEventListener('popstate', event => {
      event.preventDefault();
      this.changePage(document.location);
    });

    linkHijacker.hijack(
      {
        skipFilter: link => link.hasAttribute('data-no-hijack')
      },
      this.routeTo
    );

    this.setState({
      location: getContextLocation()
    });
  }

  /**
   * Converts input to a location object.
   * If it matches a route, go there dynamically and scroll to the top of the viewport.
   * If it doesn't match a route, go there non-dynamically.
   *
   * @param {HTMLAnchorElement | string} input - See docs for linkToLocation.
   */
  routeTo = input => {
    const targetLocation = linkToLocation(input);
    if (findMatchingRoute(targetLocation.pathname) === undefined) {
      return window.location.assign(input);
    }
    this.changePage(targetLocation, {
      pushState: true,
      scrollToTop: true
    });
  };

  // To change the page, we need to
  // - Get the matching page module, which is an async Webpack bundle.
  // - Use pushState to change the URL and add a new history entry.
  // - Change the state of this component to render the new page.
  // - Adjust scroll position on the new page.
  changePage = (nextLocation, options = {}, callback) => {
    const matchingRoute = findMatchingRoute(nextLocation.pathname);
    const nextUrl = [
      nextLocation.pathname,
      nextLocation.hash,
      nextLocation.search
    ].join('');
    matchingRoute.getPage().then(pageModule => {
      if (options.pushState) {
        window.history.pushState({}, null, nextUrl);
      }
      const nextState = {
        path: matchingRoute.path,
        pageComponent: pageModule.component.default || pageModule.component,
        pageProps: pageModule.props,
        location: getContextLocation()
      };
      this.setState(nextState, () => {
        if (options.scrollToTop) {
          window.scrollTo(0, 0);
        } else if (scrollRestorer.getSavedScroll()) {
          scrollRestorer.restoreScroll();
        } else {
          scrollToFragment();
        }
        if (callback) callback();
      });
    });
  };

  render() {
    if (!this.state.pageComponent) return null;

    return (
      <this.state.pageComponent
        location={this.state.location}
        {...this.state.pageProps}
      />
    );
  }
}

module.exports = Router;
