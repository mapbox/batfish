'use strict';

const React = require('react');
const Android = require('../svg/android.svg');

class Svg extends React.PureComponent {
  render() {
    return (
      <div>
        <Android style={{ fill: 'lightgreen' }} />
      </div>
    );
  }
}

module.exports = Svg;
