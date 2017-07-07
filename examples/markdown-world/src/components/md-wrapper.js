'use strict';
const React = require('react');
const PageShell = require('./page-shell');
const PageHero = require('./page-hero');
class MdWrapper extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title={this.props.frontMatter.title}
          description={this.props.frontMatter.description}
        />
        <div className="prose my36 px36">
          {this.props.children}
        </div>
      </PageShell>
    );
  }
}
module.exports = MdWrapper;
