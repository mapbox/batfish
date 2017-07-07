'use strict';
const React = require('react');
class PageNavigation extends React.Component {
  render() {
    return (
      <div className="absolute top left right align-center px24 py24 bg-darken25">
        <a className="link color-white inline-block mr24" href={'/'}>
          Home
        </a>
        <a className="link color-white inline-block mr24" href={'/code-blocks'}>
          Code Blocks
        </a>
        <a className="link color-white inline-block mr24" href={'/layouts'}>
          Layouts
        </a>
        <a className="link color-white inline-block" href={'/markdown-react'}>
          Markdown + React
        </a>
      </div>
    );
  }
}
module.exports = PageNavigation;
