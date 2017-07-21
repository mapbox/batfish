/*---
title: Security
description: blah blah blah
---*/
import React from 'react';
import {
  addRouteChangeStartListener,
  addRouteChangeEndListener
} from '@mapbox/batfish/modules/route-change-listeners';
import { PageShell } from '../../components/page-shell';
import { sharedImport } from '../../components/shared-import';
sharedImport();

addRouteChangeStartListener('/about/security/', pathname => {
  console.log(`${pathname} starting to load`);
});

addRouteChangeEndListener('/about/security/', pathname => {
  console.log(`${pathname} ending its load`);
});

class Security extends React.Component {
  render() {
    return <PageShell>security</PageShell>;
  }
}

export default Security;
