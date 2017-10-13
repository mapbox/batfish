import React from 'react';

export default class ApplicationWrapper extends React.Component {
  render() {
    return <div id="application-wrapper">{this.props.children}</div>;
  }
}
