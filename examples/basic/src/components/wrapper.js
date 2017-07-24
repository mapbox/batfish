import React, { PureComponent } from 'react';
import '../style.css';
export default class Wrapper extends PureComponent {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
