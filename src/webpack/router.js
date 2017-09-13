// @flow
import React from 'react';
import PropTypes from 'prop-types';
import linkHijacker from '@mapbox/link-hijacker';
import scrollRestorer from '@mapbox/scroll-restorer';
import linkToLocation from '@mapbox/link-to-location';
import querySelectorContainsNode from '@mapbox/query-selector-contains-node';
import { batfishContext } from 'batfish-internal/context';
import { routeTo } from '@mapbox/batfish/modules/route-to';
import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { findMatchingRoute } from './find-matching-route';
import { scrollToFragment } from './scroll-to-fragment';
import { getWindow } from './get-window';
import { changePage } from './change-page';
import { getCurrentLocation } from './get-current-location';

// See explanation for this weirdness in prefix-url.js.
// This happens outside the component lifecycle so it can be used during
// rendering of HTML.
prefixUrl._configure(
  batfishContext.selectedConfig.siteBasePath,
  batfishContext.selectedConfig.siteOrigin
);

type Props = {
  startingPath: string,
  startingComponent: React$ComponentType<*>,
  startingProps: Object
};

export type RouterState = {
  path: string,
  PageComponent: React$ComponentType<*>,
  pageProps: Object,
  location: BatfishLocation
};

class Router extends React.PureComponent<Props, RouterState> {
  constructor(props: Props) {
    super(props);
    const location: BatfishLocation = {
      pathname: this.props.startingPath
    };
    if (typeof window !== 'undefined') {
      const win = getWindow();
      location.search = win.location.search;
      location.hash = win.location.hash;
    }
    this.state = {
      path: this.props.startingPath,
      PageComponent: this.props.startingComponent,
      pageProps: this.props.startingProps,
      location
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

    routeTo._setRouteToHandler(this.routeTo);
    const win = getWindow();
    win.addEventListener('popstate', event => {
      event.preventDefault();
      changePage(
        {
          pathname: win.location.pathname,
          search: win.location.search,
          hash: win.location.hash
        },
        this.setState.bind(this)
      );
    });

    if (batfishContext.selectedConfig.hijackLinks) {
      linkHijacker.hijack(
        {
          skipFilter: link =>
            querySelectorContainsNode('[data-batfish-no-hijack]', link)
        },
        this.routeTo
      );
    }

    this.setState({
      location: getCurrentLocation()
    });
  }

  // Converts input to a location object.
  // If it matches a route, go there dynamically and scroll to the top of the viewport.
  // If it doesn't match a route, go there non-dynamically.
  routeTo = (input: string | HTMLAnchorElement) => {
    const win = getWindow();
    const targetLocation: BatfishLocation = linkToLocation(input);
    if (findMatchingRoute(targetLocation.pathname).is404) {
      return win.location.assign(input);
    }
    changePage(targetLocation, this.setState.bind(this), {
      pushState: true,
      scrollToTop:
        win.location.pathname !== targetLocation.pathname ||
        !targetLocation.hash
    });
  };

  render() {
    const { PageComponent } = this.state;
    if (!PageComponent) return null;

    return (
      <PageComponent location={this.state.location} {...this.state.pageProps} />
    );
  }
}

Router.childContextTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    hash: PropTypes.string,
    search: PropTypes.string
  }).isRequired
};

export { Router };
