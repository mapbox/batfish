/* globals DEFINED */
import React from 'react';
import _ from 'lodash';
export default class Home extends React.PureComponent {
  render() {
    const nestedNumber = {
      foo: {
        bar: {
          baz: 3,
          bap: 4,
        },
      },
    };

    return (
      <div>
        <h1>Optimization loaders and plugins</h1>
        Did the DefinePlugin work?{' '}
        <span style={{ fontWeight: 'bold' }}>
          {DEFINED === 'yes' ? 'Yes!' : 'No!'}
        </span>
        <div style={{ marginTop: 30 }}>
          <img src={require('../img/man-in-a-bottle.jpg')} />
        </div>
        <div style={{ marginTop: 30 }}>
          The Lodash plugin works if the following does not say "3":{' '}
          <code style={{ background: '#000', color: '#fff', padding: '1em' }}>
            {_.get(nestedNumber, 'foo.bar.baz', '☉_☉')}
          </code>
        </div>
      </div>
    );
  }
}
