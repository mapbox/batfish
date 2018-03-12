// @flow
import React from 'react';
import ApplicationWrapper from 'batfish-internal/application-wrapper';

type Props = {
  pageModule: {
    component: React$ComponentType<*>,
    props: Object
  }
};

export class BatfishSpaApp extends React.Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const body = React.createElement(
      this.props.pageModule.component,
      this.props.pageModule.props
    );
    return <ApplicationWrapper>{body}</ApplicationWrapper>;
  }
}
