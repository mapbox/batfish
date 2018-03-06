import React from 'react';

// This page uses relies on the :: syntax sugar provided by
// https://github.com/gajus/babel-plugin-transform-function-composition

const add = (x, y) => x + y;
const subtractFrom = (x, y) => x - y;

export default class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Fancy syntax sugar!</h1>
        <p>
          This should be true: <code>0 === {4::add(3)::subtractFrom(7)}</code>
        </p>
      </div>
    );
  }
}
