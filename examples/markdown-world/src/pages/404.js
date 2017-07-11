/* eslint-disable filenames/match-regex */
/*---
title: 404
description: Here to show off paths not found
---*/
'use strict';
const React = require('react');
const PageShell = require('../components/page-shell');
const PageHero = require('../components/page-hero');
class NotFoundPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="red-light"
          title="404"
          description="#sorrynotsorry."
        />
        <div className="my120 px36">Ack, you seem lost.</div>
      </PageShell>
    );
  }
}
module.exports = NotFoundPage;
