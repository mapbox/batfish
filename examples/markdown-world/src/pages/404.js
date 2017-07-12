/* eslint-disable filenames/match-regex */
/*---
title: 404
description: Here to show a custom 404 page
---*/
'use strict';
const React = require('react');
const md = require('batfish/md');
const PageShell = require('../components/page-shell');
const PageHero = require('../components/page-hero');
class NotFoundPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="red-light"
          title="404"
          description="Here to show a custom 404 page"
        />
        <div className="my36 px36 prose">{md`#### Ack, you seem lost.`}</div>
      </PageShell>
    );
  }
}
module.exports = NotFoundPage;
