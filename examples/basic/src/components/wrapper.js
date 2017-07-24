import React from 'react';
import '../style.css';
export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
