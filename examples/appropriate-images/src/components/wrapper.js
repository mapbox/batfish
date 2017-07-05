'use strict';

const React = require('react');

class Wrapper extends React.PureComponent {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <a href="/">home</a>
            </li>
            <li>
              <a href="/svg">svg</a>
            </li>
          </ul>
          <hr />
        </nav>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Wrapper;
