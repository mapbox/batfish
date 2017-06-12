/*---
title: About
description: blah blah blah
---*/
'use strict';

const React = require('react');
const PageShell = require('../../components/page-shell');
const prefixUrl = require('batfish/prefix-url');

class About extends React.Component {
  render() {
    return (
      <PageShell>
        about

        <button
          className="btn"
          onClick={() => global.batfish.routeTo(prefixUrl('/about/security/'))}
        >
          Read about security
        </button>
      </PageShell>
    );
  }
}

module.exports = About;
