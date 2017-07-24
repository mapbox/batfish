import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
export default class PageShell extends PureComponent {
  render() {
    return (
      <div>
        <Helmet>
          <title>
            {this.props.title} | Batfish
          </title>
          <meta name="description" content={this.props.description} />
        </Helmet>
        <div className=" px30 py120">
          {this.props.children}
        </div>
      </div>
    );
  }
}
PageShell.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};
