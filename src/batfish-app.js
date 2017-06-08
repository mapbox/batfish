'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('./router');

class App extends React.Component {
  render() {
    return (
      <div>
        <Router />
      </div>
    );
  }
}

let container = document.getElementById('batfish-content');
if (!container) {
  container = document.createElement('div');
  document.body.appendChild(container);
}
ReactDOM.render(<App />, container);
