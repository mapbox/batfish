import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';

export default class PageShell extends React.Component {
  render() {
    const { props } = this;
    return (
      <div>
        <Helmet>
          <html lang="en" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>
            {props.frontMatter.title} | Batfish Miscellany
          </title>
          <meta name="description" content={props.frontMatter.description} />
          {/* Facebook tags */}
          <meta name="og:title" content={props.frontMatter.title} />
          <meta name="og:description" content={props.frontMatter.description} />
          <meta name="og:type" content="website" />
          <meta
            name="og:url"
            content={`https://www.your-batfish-site.com/miscellany${props
              .location.pathname}`}
          />
        </Helmet>
        <div className="px24 py24 mx-auto" style={{ maxWidth: 960 }}>
          <div className="mb36 flex-parent flex-parent--center-cross bg-gray px24 py12">
            <a
              className="flex-child link link--white txt-bold txt-uppercase"
              href={prefixUrl('/')}
            >
              Home
            </a>
            <a
              className="flex-child link link--white txt-bold txt-uppercase ml24"
              href={prefixUrl('/holidays/')}
            >
              Holidays
            </a>
            <a
              className="flex-child link link--white txt-bold txt-uppercase ml24"
              href={prefixUrl('/stories/')}
            >
              Stories
            </a>
          </div>
          {props.children}
        </div>
      </div>
    );
  }
}

PageShell.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  frontMatter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired
};
