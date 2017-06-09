/*---
title: Home away from home
description: Everything you ever wanted
---*/
'use strict';

const React = require('react');
const PageShell = require('../components/page-shell');

class Home extends React.Component {
  render() {
    return (
      <PageShell>
        <div>
          {this.props.title}
        </div>
        <div className="mt24">
          {this.props.description}
        </div>
        <div className="mt24">
          <div className="txt-bold txt-l mb12">
            Posts
          </div>
          {this.props.posts.map(post => {
            return (
              <div key={post.path} className="mt6">
                <a href={post.path} className="link">
                  {post.data.title}
                </a>
              </div>
            );
          })}
        </div>
      </PageShell>
    );
  }
}

module.exports = Home;
