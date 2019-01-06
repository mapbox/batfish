// @flow
import React from 'react';
import { batfishContext } from 'batfish-internal/context';
import { renderAppIntoDom } from './render-app-into-dom';
import { BatfishSpaApp } from './batfish-spa-app';

const matchingRoute = batfishContext.routes[0];

matchingRoute.getPage().then((pageModule) => {
  renderAppIntoDom(<BatfishSpaApp pageModule={pageModule} />);
});
