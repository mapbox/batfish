// @flow
'use strict';

function init(batfishConfig: BatfishConfiguration) {
  function stripSiteBasePath(
    req: { url: string },
    res: Object,
    next: Function
  ) {
    if (req.url.startsWith(batfishConfig.siteBasePath)) {
      req.url = req.url.replace(batfishConfig.siteBasePath, '') || '/';
    }
    next();
  }

  return {
    stripSiteBasePath
  };
}

module.exports = {
  init
};
