// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from './router';
import { findMatchingRoute } from './find-matching-route';
import ApplicationWrapper from 'batfish-internal/application-wrapper';
import {
  addRouteChangeEndListener,
  removeRouteChangeEndListener
} from '@mapbox/batfish/modules/route-change-listeners';
import { focusContentEntry } from '@mapbox/batfish/modules/focus-content-entry';

// The initialization of any Batfish.
// Get the current page and render it, wrapped in the user's ApplicationWrapper
// component.

const startingPath = window.location.pathname;
const matchingRoute = findMatchingRoute(startingPath);
matchingRoute.getPage().then(pageModule => {
  class App extends React.PureComponent<{}> {
    componentDidMount() {
      focusContentEntry();
      addRouteChangeEndListener(focusContentEntry);
    }

    componentWillUnmount() {
      removeRouteChangeEndListener(focusContentEntry);
    }

    shouldComponentUpdate() {
      return false;
    }

    render() {
      return (
        <ApplicationWrapper>
          <Router
            startingPath={startingPath}
            startingComponent={pageModule.component}
            startingProps={pageModule.props}
          />
        </ApplicationWrapper>
      );
    }
  }

  ReactDOM.render(<App />, document.getElementById('batfish-content'));
});
