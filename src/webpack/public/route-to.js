// @flow
import { prefixUrl } from './prefix-url';

let delayed: string | void;
let onRouteTo: ?(string) => void;

function routeTo(url: string) {
  if (!onRouteTo) {
    delayed = url;
    return;
  }
  onRouteTo(url);
}

function routeToPrefixed(url: string) {
  routeTo(prefixUrl(url));
}

// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._onRouteTo = (handler: string => void) => {
  onRouteTo = handler;
  if (delayed) onRouteTo(delayed);
};

export { routeTo, routeToPrefixed };
