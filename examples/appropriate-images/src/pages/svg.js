import React, { PureComponent } from 'react';
import { default as Android } from '../svg/android.svg';
export default class Svg extends PureComponent {
  render() {
    return (
      <div>
        <Android style={{ fill: 'lightgreen' }} />
      </div>
    );
  }
}
