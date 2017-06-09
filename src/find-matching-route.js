'use strict';

const batfishContext = require('batfish/context');

const pathRegExps = batfishContext.routes.reduce((result, route) => {
  result[route.path] = new RegExp(`^${route.path.replace(/\//g, '[/]')}?$`);
  return result;
}, {});

/**
 * Find the route data that matches a path.
 *
 * @param {string} path
 * @return {?Object} - Undefined if no matching route exists.
 */
function findMatchingRoute(path) {
  for (let i = 0, l = batfishContext.routes.length; i < l; i++) {
    const route = batfishContext.routes[i];
    if (pathRegExps[route.path].test(path)) {
      return route;
    }
  }
}

module.exports = findMatchingRoute;
