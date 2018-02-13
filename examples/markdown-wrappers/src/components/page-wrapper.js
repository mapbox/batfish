import React from 'react';

export default class PageWrapper extends React.PureComponent {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <a href="/">home</a>
            </li>
            <li>
              <a href="/markdown-a">Markdown wrapper A</a>
            </li>
            <li>
              <a href="/markdown-b">Markdown wrapper B</a>
            </li>
            <li>
              <a href="/markdown-c">Markdown wrapper A explicitly requested</a>
            </li>
            <li>
              <a href="/markdown-fake-a">
                Markdown wrapper B explicitly requested
              </a>
            </li>
          </ul>
          <hr />
        </nav>
        {this.props.children}
      </div>
    );
  }
}
