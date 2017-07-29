import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from './router';
import { findMatchingRoute } from './find-matching-route';
import ApplicationWrapper from 'batfish-internal/application-wrapper';

// The initialization of any Batfish.
// Get the current page and render it, wrapped in the user's ApplicationWrapper
// component.

const startingPath = window.location.pathname;
const matchingRoute = findMatchingRoute(startingPath, { notFound: true });
matchingRoute.getPage().then(pageModule => {
  class App extends React.PureComponent {
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

  let container = document.getElementById('batfish-content');
  // On the development server, this container element will not yet exist.
  // In the static HTML build, though, it will.
  if (!container) {
    container = document.createElement('div');
    container.id = 'batfish-content';
    document.body.appendChild(container);
  }

  ReactDOM.render(<App />, container);
});
