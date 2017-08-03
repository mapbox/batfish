/*---
title: About
description: blah blah blah
---*/
import React from 'react';
import { PageShell } from '../../components/page-shell';
import { routeToPrefixed } from '@mapbox/batfish/modules/route-to';
import { sharedImport } from '../../components/shared-import';
import pigNames from '@mapbox/batfish/data/pig-names';
sharedImport();

class About extends React.Component {
  render() {
    return (
      <PageShell>
        about
        <button
          className="btn"
          onClick={() => routeToPrefixed('about/security/')}
        >
          Read about security
        </button>
        <div className="mt24">Pig names: {pigNames.join(', ')}</div>
      </PageShell>
    );
  }
}

export default About;
