import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';

let delayed;
let onRouteTo;

function routeTo(url) {
  if (!onRouteTo) {
    delayed = url;
    return;
  }
  onRouteTo(url);
}

function routeToPrefixed(url) {
  routeTo(prefixUrl(url));
}

// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._onRouteTo = fn => {
  onRouteTo = fn;
  if (delayed) onRouteTo(delayed);
};

export { routeTo, routeToPrefixed };
