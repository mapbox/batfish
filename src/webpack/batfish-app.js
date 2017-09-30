// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from './router';
import { findMatchingRoute } from './find-matching-route';
import ApplicationWrapper from 'batfish-internal/application-wrapper';

// The initialization of any Batfish app.
// Get the current page and render it, wrapped in the user's ApplicationWrapper
// component.

const startingPath = window.location.pathname;
const matchingRoute = findMatchingRoute(startingPath);
matchingRoute.getPage().then(pageModule => {
  class App extends React.Component<{}> {
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

  // React 16 has ReactDOM.hydrate for hydrating server-rendered markdup.
  const render =
    process.env.DEV_SERVER || !ReactDOM.hydrate
      ? ReactDOM.render
      : ReactDOM.hydrate;
  render(<App />, document.getElementById('batfish-content'));
});
