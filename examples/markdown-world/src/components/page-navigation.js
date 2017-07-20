const React = require('react');
const prefixUrl = require('@mapbox/batfish/modules/prefix-url');
class PageNavigation extends React.Component {
  render() {
    return (
      <div className="absolute top left right align-center px24 py24 bg-darken25">
        <a className="link color-white inline-block mr24" href={prefixUrl('/')}>
          Home
        </a>
        <a
          className="link color-white inline-block mr24"
          href={prefixUrl('/sample')}
        >
          Sample
        </a>
        <a
          className="link color-white inline-block mr24"
          href={prefixUrl('/layouts')}
        >
          Layouts
        </a>
        <a
          className="link color-white inline-block"
          href={prefixUrl('/markdown-react')}
        >
          Markdown + React
        </a>
      </div>
    );
  }
}
module.exports = PageNavigation;
