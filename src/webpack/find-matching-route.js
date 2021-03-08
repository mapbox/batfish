// @flow
import { batfishContext } from 'batfish-internal/context';

// Returns an array of regular expressions that are used to check whether a URL
// path matches one of the routes.
function createPathRegExps(
  routes: Array<BatfishRouteData>
): { [string]: RegExp } {
  return routes.reduce((result, route) => {
    // Pages with internal routing aren't just exact matches.
    const ending = route.internalRouting ? '(/.+)?$' : '$';
    // ? because the last slash is optional
    // and check if `index.html` has an extensionless route
    result[route.path] = new RegExp(
      `^${route.path.replace(/\//g, '[/]')}?(index.html)?${ending}`
    );
    return result;
  }, {});
}

let pathRegExpsCache;
let urlPathsCache: { [string]: BatfishRouteData } = {};

// Find the route data that matches a URL path.
//
// Returns the matching route, or the not-found route if no matching route exists.
export function findMatchingRoute(
  urlPath: string,
  options?: { useCache?: boolean }
): BatfishRouteData {
  options = options || {};
  const useCache = options.useCache === undefined ? true : options.useCache;

  if (useCache && urlPathsCache[urlPath]) {
    return urlPathsCache[urlPath];
  }

  let pathRegExps;
  if (useCache && pathRegExpsCache) {
    pathRegExps = pathRegExpsCache;
  } else {
    pathRegExps = createPathRegExps(batfishContext.routes);
    pathRegExpsCache = pathRegExps;
  }

  let result;

  for (let i = 0; i < batfishContext.routes.length; i++) {
    const route = batfishContext.routes[i];
    if (pathRegExps[route.path].test(urlPath)) {
      result = route;
      break;
    }
  }

  if (!result) {
    result = batfishContext.notFoundRoute;
  }

  urlPathsCache[urlPath] = result;
  return result;
}
