'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Wrapper = require('batfish/wrapper');
const Router = require('./router');
const findMatchingRoute = require('./find-matching-route');

// Get the current page and render it, wrapped in the user's Wrapper component.

const startingPath = window.location.pathname;
const matchingRoute = findMatchingRoute(startingPath);
matchingRoute.getPage().then(pageModule => {
  class App extends React.PureComponent {
    shouldComponentUpdate() {
      return false;
    }

    render() {
      return (
        <Wrapper>
          <Router
            startingPath={startingPath}
            startingComponent={pageModule.component}
            startingData={pageModule.data}
          />
        </Wrapper>
      );
    }
  }

  let container = document.getElementById('batfish-content');
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  ReactDOM.render(<App />, container);
});
