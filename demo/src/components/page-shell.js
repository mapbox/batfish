'use strict';

const React = require('react');

class PageShell extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        <hr />
        <div>
          <a href="/">home</a>
        </div>
        <div>
          <a href="/about">about</a>
        </div>
        <div>
          <a href="/about/security">about/security</a>
        </div>
        <div>
          <a href="/posts/one">one</a>
        </div>
        <div>
          <a href="/posts/two">two</a>
        </div>
      </div>
    );
  }
}

module.exports = PageShell;
