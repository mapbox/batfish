import React, { PureComponent } from 'react';
import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
export default class NotFound extends PureComponent {
  render() {
    return (
      <div>
        Oops, this is not a page.{' '}
        <a href={prefixUrl('/')} className="link">
          Go home.
        </a>
      </div>
    );
  }
}
