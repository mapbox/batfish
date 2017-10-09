import React from 'react';

export default class PageShell extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <a href="/">one</a>
          </li>
          <li>
            <a href="/two">two</a>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}
