// @flow
import React from 'react';
import { findMatchingRoute } from './find-matching-route';
import { renderAppIntoDom } from './render-app-into-dom';
import { BatfishApp } from './batfish-app';

// The initialization of any Batfish app.
// Get the current page and render it, wrapped in the user's ApplicationWrapper
// component.

const startingPath = window.location.pathname;
const matchingRoute = findMatchingRoute(startingPath);
matchingRoute.getPage().then(pageModule => {
  renderAppIntoDom(
    <BatfishApp startingPath={startingPath} pageModule={pageModule} />
  );
});
