// @flow
import type { RouterState } from './router';

import scrollRestorer from '@mapbox/scroll-restorer';
import { findMatchingRoute } from './find-matching-route';
import { scrollToFragment } from './scroll-to-fragment';
import {
  _invokeRouteChangeStartCallbacks,
  _invokeRouteChangeEndCallbacks
} from '@mapbox/batfish/modules/route-change-listeners';
import { getCurrentLocation } from './get-current-location';
import { getWindow } from './get-window';

export function changePage(
  nextLocation: BatfishLocation,
  setRouterState: (state: RouterState, callback: () => void) => void,
  options: { pushState?: boolean, scrollToTop?: boolean } = {},
  onFinish?: () => mixed
): Promise<void> {
  const win = getWindow();
  const matchingRoute = findMatchingRoute(nextLocation.pathname);
  const nextUrl = [
    nextLocation.pathname,
    nextLocation.hash,
    nextLocation.search
  ].join('');
  // Call the change-start callbacks immediately, not after the page chunk
  // has already been fetched.
  const startChange = _invokeRouteChangeStartCallbacks(nextLocation.pathname);
  return matchingRoute
    .getPage()
    .then((pageModule) => {
      return startChange.then(() => pageModule);
    })
    .then((pageModule) => {
      if (options.pushState) {
        win.history.pushState({}, null, nextUrl);
      }
      const nextState = {
        path: matchingRoute.path,
        PageComponent: pageModule.component,
        pageProps: pageModule.props,
        location: getCurrentLocation()
      };
      setRouterState(nextState, () => {
        if (nextLocation.hash) {
          scrollToFragment();
        } else if (options.scrollToTop) {
          win.scrollTo(0, 0);
        } else if (scrollRestorer.getSavedScroll()) {
          scrollRestorer.restoreScroll();
        }
        if (onFinish) onFinish();
        _invokeRouteChangeEndCallbacks(nextLocation.pathname);
      });
    });
}
