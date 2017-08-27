import React from 'react';
import Helmet from 'react-helmet';
import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';

class PageShell extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <script
            async
            defer
            src="https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.js"
          />
        </Helmet>
        <div className="wmax600 mx-auto mt60">
          {this.props.children}

          <div className="mt60 px24 py24 bg-gray-faint">
            <a className="link inline-block mr24" href={prefixUrl('/')}>
              home
            </a>
            <a className="link inline-block mr24" href={prefixUrl('/about')}>
              about
            </a>
            <a
              className="link inline-block mr24"
              href={prefixUrl('/about/security')}
            >
              about/security
            </a>
            <a
              className="link inline-block mr24"
              href={prefixUrl('/posts/one')}
            >
              one
            </a>
            <a
              className="link inline-block mr24"
              href={prefixUrl('/posts/two')}
            >
              two
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export { PageShell };
