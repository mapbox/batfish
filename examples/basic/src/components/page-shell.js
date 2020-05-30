import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default class PageShell extends React.Component {
  render() {
    const { props } = this;
    const title = `${props.frontMatter.title} | Basic`;
    return (
      <div>
        <Helmet>
          <html lang="en" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <meta name="description" content={props.frontMatter.description} />
        </Helmet>
        <div className="px30 py30">{props.children}</div>
      </div>
    );
  }
}

PageShell.propTypes = {
  frontMatter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};
