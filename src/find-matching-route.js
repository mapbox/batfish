'use strict';

const batfishContext = require('batfish-internal/context');

/**
 * Returns an array of regular expressions that are used to check whether a URL path
 * matches one of the routes.
 *
 * @param {Array<{ path: string }>} routes
 * @return {Object} - Keys are paths, values are regular expressions.
 */
function createPathRegExps(routes) {
  return routes.reduce((result, route) => {
    // Pages with internal routing aren't just exact matches.
    const ending = route.internalRouting ? '(/.+)?$' : '$';
    // ? because the last slash is optional
    result[route.path] = new RegExp(
      `^${route.path.replace(/\//g, '[/]')}?${ending}`
    );
    return result;
  }, {});
}

let pathRegExpsCache;
let urlPathsCache = {};

/**
 * Find the route data that matches a URL path.
 *
 * @param {string} urlPath
 * @param {Object} [options]
 * @param {boolean} [options.notFound=false] - If true, returns a special
 *   not-found route if no route is found.
 * @param {boolean} [options.useCache=true]
 * @return {?Object} - The matching route, or `undefined` or a not-found route
 *   if no matching route exists.
 */
function findMatchingRoute(urlPath, options = {}) {
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

  if (!result && options.notFound) {
    result = {
      path: urlPath,
      getPage: batfishContext.getNotFoundPage,
      internalRouting: false
    };
  }

  urlPathsCache[urlPath] = result;
  return result;
}

module.exports = findMatchingRoute;
