// @flow
'use strict';

module.exports = function getEnvBrowserslist(
  prodBrowserslist: string | Array<string>,
  devBrowserslist: string | Array<string> | false,
  isProduction: boolean
): string | Array<string> {
  if (devBrowserslist === false || isProduction) {
    return prodBrowserslist;
  }
  return devBrowserslist;
};
