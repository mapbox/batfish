'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const batfishContext = require('batfish/context');
const findMatchingRoute = require('./find-matching-route');
const hijackLink = require('./hijack-links');

class Router extends React.PureComponent {
  static propTypes = {
    startingRoute: PropTypes.string.isRequired,
    startingComponent: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      pageComponent: this.props.startingComponent
    };
  }

  componentDidMount() {
    if (!this.state.pageComponent) {
      this.changePage(window.location);
    }

    window.addEventListener('popstate', () => {
      this.changePage(document.location);
    });

    hijackLink((link, event) => {
      let path = link.pathname;
      if (!/\/$/.test(path)) path += '/';
      if (!this.pathIsRoute(path)) {
        return window.location.assign(link);
      }

      event.preventDefault();
      const linkLocation = {
        origin: link.origin,
        pathname: path,
        hash: link.hash,
        search: link.search
      };
      this.changePage(linkLocation, { pushState: true });
    });
  }

  changePage = (nextLocation, options = {}) => {
    const matchingRoute = findMatchingRoute(nextLocation.pathname);
    const nextUrl = [
      nextLocation.origin,
      matchingRoute.path,
      nextLocation.hash,
      nextLocation.search
    ].join('');
    matchingRoute.getModule().then(routeModule => {
      if (options.pushState) {
        window.history.pushState({}, null, nextUrl);
      }
      this.setState({
        pageComponent: routeModule.component
      });
    });
  };

  pathIsRoute = path => {
    return batfishContext.routesData.some(route => {
      return route.path.replace(/\/$/, '') === path.replace(/\/$/, '');
    });
  };

  render() {
    if (!this.state.pageComponent) return null;

    let location = typeof window !== 'undefined'
      ? document.location
      : {
          pathname: this.state.pathname
        };

    return React.createElement(this.state.pageComponent, { location });
  }
}

module.exports = Router;
