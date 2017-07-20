/*---
title: Unpublished React Page
description: Here to demostrate an unpublished React page
published: false
---*/

const React = require('react');
const md = require('batfish/md');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
class UnpublishedPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Unpublished React Page"
          description="Here to demonstrate an unpublished React page"
        />
        <div className="my36 px36 prose">
          {md`#### This page should be seen in development but not production!`}
        </div>
      </PageShell>
    );
  }
}
module.exports = UnpublishedPage;
