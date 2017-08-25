/*---
title: Home
description: The home page of my miscellany.
---*/

import React from 'react';
import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import PageShell from '../components/page-shell';

export default class Home extends React.Component {
  render() {
    const { props } = this;

    return (
      <PageShell {...props}>
        <h1 className="txt-h1 txt-bold mb12">The Batfish Miscellany</h1>
        <div className="my24">
          <a
            className="link link--purple txt-h3"
            href={prefixUrl('/holidays/')}
          >
            Read about holidays.
          </a>
        </div>
        <div className="my24">
          <a className="link link--purple txt-h3" href={prefixUrl('/stories/')}>
            Read stories by Stephen Crane.
          </a>
        </div>
      </PageShell>
    );
  }
}
