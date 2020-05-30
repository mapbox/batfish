// @flow
import React from 'react';
import { Router } from './router';
import ApplicationWrapper from 'batfish-internal/application-wrapper';

type Props = {
  startingPath: string,
  pageModule: {
    component: React$ComponentType<*>,
    props: Object,
  },
};

export class BatfishApp extends React.Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ApplicationWrapper>
        <Router
          startingPath={this.props.startingPath}
          startingComponent={this.props.pageModule.component}
          startingProps={this.props.pageModule.props}
        />
      </ApplicationWrapper>
    );
  }
}
