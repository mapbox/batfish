/*---
title: About
description: blah blah blah
---*/
import React from 'react';
import { PageShell } from '../../components/page-shell';
import { routeToPrefixed } from '@mapbox/batfish/modules/route-to';

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
      </PageShell>
    );
  }
}

export default About;
