/*---
title: Trickster
description: Here to show rerouting
---*/

'use strict';
const React = require('react');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
const routeTo = require('batfish/route-to');
class TricksterPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Trickster"
          description="Here to show rerouting"
        />
        <div className="my120 px36">
          <h1>
            This page won''t even be seen because it automatically gets routed
            to home!
          </h1>
        </div>
        {routeTo('/')}
      </PageShell>
    );
  }
}
module.exports = TricksterPage;
