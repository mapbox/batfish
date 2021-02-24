import React from 'react';
import iframe from './example/simple-map.html';
export default class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Sitemap demo</h1>
        <p>
          The url{' '}
          <code>
            https://www.batfish-basic.com{iframe.replace('.html', '')}
          </code>{' '}
          should not appear in the <a href="/sitemap.xml">sitemap</a>.
        </p>
        <iframe src={iframe} title="Simple map" />
      </div>
    );
  }
}
