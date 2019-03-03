import React from 'react';

import styles from './FilterButton.scss';

function FilterButton(props) {
  let className;
  if (props.isVisible) {
    if (props.isFilterVisible) {
      className = styles.hideFilter;
    } else {
      className = styles.root;
    }
  } else {
    className = styles.hidden;
  }

  return (
    <button className={className} onClick={props.onClick}>
      Filter <span className="glyphicon glyphicon-menu-right" />
    </button>
  );
}

export default FilterButton;
