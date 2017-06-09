/*---
title: Home away from Home
description: Everything you you ever wanted
---*/
'use strict';

const React = require('react');
const PageShell = require('../components/page-shell');

class Home extends React.Component {
  render() {
    return (
      <PageShell>
        home

        <div>
          {this.props.title}
        </div>
        <div>
          {this.props.description}
        </div>
      </PageShell>
    );
  }
}

module.exports = Home;
