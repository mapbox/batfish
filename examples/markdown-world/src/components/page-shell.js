'use strict';
const React = require('react');
const PageNavigation = require('./page-navigation');
class PageShell extends React.Component {
  render() {
    return (
      <div className="wmax480 mx-auto mt72">
        <PageNavigation />
        {this.props.children}
      </div>
    );
  }
}
module.exports = PageShell;
