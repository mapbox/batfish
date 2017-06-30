'use strict';

import React from 'react';
import _ from 'lodash';

class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Testing optimization loaders and plugins</h1>

        <div style={{ marginTop: 30 }}>
          <img src={require('../img/man-in-a-bottle.jpg')} />
        </div>

        <div style={{ marginTop: 30 }}>
          Random number: {_.random(0, 100)}
        </div>
      </div>
    );
  }
}

export default Home;
