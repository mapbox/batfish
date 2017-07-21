import React, { PureComponent } from 'react';
import _ from 'lodash';
export default class Home extends PureComponent {
  render() {
    const nestedNumber = {
      foo: {
        bar: {
          baz: 3
        }
      }
    };

    return (
      <div>
        <h1>Testing optimization loaders and plugins</h1>

        <div style={{ marginTop: 30 }}>
          <img src={require('../img/man-in-a-bottle.jpg')} />
        </div>

        <div style={{ marginTop: 30 }}>
          The nested number: {_.get(nestedNumber, 'foo.bar.baz')}
        </div>
      </div>
    );
  }
}
