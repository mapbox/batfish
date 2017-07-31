import React, { PureComponent } from 'react';

export default class Wrapper extends PureComponent {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
