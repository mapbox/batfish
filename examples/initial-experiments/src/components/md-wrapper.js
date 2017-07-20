import React from 'react';
import { PageShell } from './page-shell';

class MdWrapper extends React.Component {
  render() {
    return (
      <PageShell>
        <div className="prose">
          {this.props.children}
        </div>
      </PageShell>
    );
  }
}

export default MdWrapper;
