'use strict';

const batfishContext = require('batfish/context');

function findMatchingRoute(path) {
  for (let i = 0, l = batfishContext.routesData.length; i < l; i++) {
    const route = batfishContext.routesData[i];
    if (route.pathRegExp.test(path)) {
      return route;
    }
  }
}

module.exports = findMatchingRoute;
