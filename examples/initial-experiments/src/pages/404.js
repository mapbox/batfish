/* eslint-disable filenames/match-regex */
'use strict';

const React = require('react');
const prefixUrl = require('@mapbox/batfish/prefix-url');

class NotFound extends React.PureComponent {
  render() {
    return (
      <div>
        Oops, this is not a page.{' '}
        <a href={prefixUrl('/')} className="link">
          Go home.
        </a>
      </div>
    );
  }
}

module.exports = NotFound;
