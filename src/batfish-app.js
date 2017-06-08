'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Wrapper = require('batfish/wrapper');
const Router = require('./router');
const findMatchingRoute = require('./find-matching-route');

const startingRoute = window.location.pathname;
const matchingRoute = findMatchingRoute(startingRoute);
matchingRoute.getModule().then(startingRouteModule => {
  class App extends React.PureComponent {
    shouldComponentUpdate() {
      return false;
    }

    render() {
      return (
        <Wrapper>
          <Router
            startingRoute={startingRoute}
            startingComponent={startingRouteModule.component}
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
