'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const findMatchingRoute = require('./find-matching-route');
const hijackLink = require('./hijack-links');
const scrollToFragment = require('./scroll-to-fragment');
const linkToLocation = require('./link-to-location');
const scrollRestoration = require('./scroll-restoration');

class Router extends React.PureComponent {
  static propTypes = {
    startingPath: PropTypes.string.isRequired,
    startingComponent: PropTypes.func.isRequired,
    startingProps: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      path: this.props.startingPath,
      pageComponent: this.props.startingComponent,
      pageProps: this.props.startingProps
    };
  }

  componentDidMount() {
    scrollRestoration.start();
    if (process.env.DEV_SERVER) {
      scrollToFragment();
    }
    // Expose batfish.routeTo for programmatic route changes/
    global.batfish = global.batfish || {};
    global.batfish.routeTo = this.routeTo;
    window.addEventListener('popstate', () => {
      this.changePage(document.location);
    });

    hijackLink(this.routeTo);
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
    this.changePage(targetLocation, { pushState: true }, () => {
      window.scrollTo(0, 0);
    });
  };

  // To change the page, we need to
  // - Get the patching page module, which is an async Webpack bundle.
  // - Use pushState to change the URL and add a new history entry.
  // - Change the stats of this component to render the new page.
  // - Scroll to the fragment if there is one.
  changePage = (nextLocation, options = {}, callback) => {
    const matchingRoute = findMatchingRoute(nextLocation.pathname);
    const nextUrl = [
      matchingRoute.path,
      nextLocation.hash,
      nextLocation.search
    ].join('');
    matchingRoute.getPage().then(pageModule => {
      if (options.pushState) {
        window.history.pushState({}, null, nextUrl);
      }
      this.setState(
        {
          path: matchingRoute.path,
          pageComponent: pageModule.component,
          pageProps: pageModule.props
        },
        () => {
          if (callback) callback();
          scrollToFragment();
        }
      );
    });
  };

  render() {
    if (!this.state.pageComponent) return null;

    const location = typeof window !== 'undefined'
      ? document.location
      : { pathname: this.state.pathname };

    return (
      <this.state.pageComponent location={location} {...this.state.pageProps} />
    );
  }
}

module.exports = Router;
