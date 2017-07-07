'use strict';
const React = require('react');
const PageShell = require('./page-shell');
const PageHero = require('./page-hero');
class MdWrapper extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          height="600"
          bgColor="pink-light"
          title={this.props.frontMatter.title}
          description={this.props.frontMatter.description}
        />
        <div className="grid grid--gut12 hmin120">
          <div className="col col--6 bg-blue-light">
            {this.props.frontMatter.left}
          </div>
          <div className="col col--6 bg-green-light">
            {this.props.frontMatter.right}
          </div>
        </div>
        <div className="prose my36 px36">
          {this.props.children}
        </div>
      </PageShell>
    );
  }
}
module.exports = MdWrapper;
