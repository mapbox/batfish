import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

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
            {props.frontMatter.title} | BatfishBlog
          </title>
          <meta name="description" content={props.frontMatter.description} />
          {/* Facebook tags */}
          <meta name="og:title" content={props.frontMatter.title} />
          <meta name="og:description" content={props.frontMatter.description} />
          <meta name="og:type" content="website" />
          <meta
            name="og:url"
            content={`https://www.your-batfish-site.com/blog${props.location
              .pathname}`}
          />
        </Helmet>
        {props.children}
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
