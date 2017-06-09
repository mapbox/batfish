'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const batfishContext = require('batfish/context');
const findMatchingRoute = require('./find-matching-route');
const hijackLink = require('./hijack-links');
const scrollToFragment = require('./scroll-to-fragment');
const linkToLocation = require('./link-to-location');
const createScrollRestorer = require('./create-scroll-restorer');

class Router extends React.PureComponent {
  static propTypes = {
    startingPath: PropTypes.string.isRequired,
    startingComponent: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      path: this.props.startingPath,
      pageComponent: this.props.startingComponent
    };
  }

  componentDidMount() {
    // cf. https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    createScrollRestorer();

    scrollToFragment();

    window.addEventListener('popstate', () => {
      this.changePage(document.location);
    });

    hijackLink(this.routeTo);

    global.batfish = global.batfish || {};
    global.batfish.routeTo = this.routeTo;
  }

  routeTo = input => {
    const targetLocation = linkToLocation(input);
    if (!this.pathIsRoute(targetLocation.pathname)) {
      return window.location.assign(input);
    }
    this.changePage(targetLocation, { pushState: true }, () => {
      window.scrollTo(0, 0);
    });
  };

  changePage = (nextLocation, options = {}, callback) => {
    const matchingRoute = findMatchingRoute(nextLocation.pathname);
    const nextUrl = [
      matchingRoute.path,
      nextLocation.hash,
      nextLocation.search
    ].join('');
    matchingRoute.getPage().then(Page => {
      if (options.pushState) {
        window.history.pushState({}, null, nextUrl);
      }
      this.setState(
        {
          path: matchingRoute.path,
          pageComponent: Page
        },
        () => {
          if (callback) callback();
          scrollToFragment();
        }
      );
    });
  };

  pathIsRoute = path => {
    return batfishContext.routes.some(route => {
      return route.path.replace(/\/$/, '') === path.replace(/\/$/, '');
    });
  };

  render() {
    if (!this.state.pageComponent) return null;

    const location = typeof window !== 'undefined'
      ? document.location
      : { pathname: this.state.pathname };

    const pageData = batfishContext.pageData[this.state.path];

    return <this.state.pageComponent location={location} {...pageData.data} />;
  }
}

module.exports = Router;
