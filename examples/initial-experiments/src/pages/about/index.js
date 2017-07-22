/*---
title: About
description: blah blah blah
injectedData:
  - pigNames
---*/
import React from 'react';
import { PageShell } from '../../components/page-shell';
import { routeToPrefixed } from '@mapbox/batfish/modules/route-to';
import { sharedImport } from '../../components/shared-import';
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
        <div className="mt24">
          Pig names: {this.props.injectedData.pigNames.join(', ')}
        </div>
      </PageShell>
    );
  }
}

export default About;
