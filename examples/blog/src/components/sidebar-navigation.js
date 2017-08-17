import React from 'react';
import PropTypes from 'prop-types';

export default class SidebarNavigation extends React.PureComponent {
  render() {
    const { props } = this;

    const itemElements = props.items.map(item => {
      let linkClasses = 'nav-link';
      if (item.active) {
        linkClasses += ' active';
      }
      return (
        <li key={item.url} className="nav-item">
          <a href={item.url} className={linkClasses}>
            {item.content}
          </a>
        </li>
      );
    });

    return (
      <div className="py-3">
        <div className="h5">
          {props.title}
        </div>
        <ul className="nav flex-column">
          {itemElements}
        </ul>
      </div>
    );
  }
}

SidebarNavigation.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
      url: PropTypes.string.isRequired,
      active: PropTypes.bool
    })
  ).isRequired
};
