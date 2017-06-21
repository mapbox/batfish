'use strict';

const React = require('react');
const PageShell = require('./page-shell');

class MdWrapper extends React.Component {
  render() {
    return (
      <PageShell>
        <div className="prose">
          {this.props.children}
        </div>
      </PageShell>
    );
  }
}

module.exports = MdWrapper;
