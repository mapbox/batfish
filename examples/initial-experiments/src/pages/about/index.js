/*---
title: About
description: blah blah blah
---*/
'use strict';

const React = require('react');
const PageShell = require('../../components/page-shell');
const routeTo = require('@mapbox/batfish/route-to');

class About extends React.Component {
  render() {
    return (
      <PageShell>
        about
        <button
          className="btn"
          onClick={() => routeTo.prefixed('about/security/')}
        >
          Read about security
        </button>
      </PageShell>
    );
  }
}

module.exports = About;
