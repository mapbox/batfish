import React from 'react';
import PropTypes from 'prop-types';

export default class SidebarNavigation extends React.PureComponent {
  render() {
    const { props } = this;

    const itemElements = props.items.map((item) => {
      let linkClasses = 'link block py6 border-b border--gray-light';
      return (
        <li key={item.url}>
          <a href={item.url} className={linkClasses}>
            {item.content}
          </a>
        </li>
      );
    });

    return (
      <div>
        <div className="txt-h3 mb12">{props.title}</div>
        <ul>{itemElements}</ul>
      </div>
    );
  }
}

SidebarNavigation.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired
};
