'use strict';

const React = require('react');
const AppropriateImage = require('../components/appropriate-image');

class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <AppropriateImage imageId="osprey" style={{ maxWidth: '100%' }} />
      </div>
    );
  }
}

module.exports = Home;
