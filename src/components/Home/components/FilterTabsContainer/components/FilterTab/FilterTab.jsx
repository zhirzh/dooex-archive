import React from 'react';
import PropTypes from 'prop-types';

import styles from './FilterTab.css';

function FilterTab(props) {
  return (
    <button
      className={styles.root}
      data-filter-type={props.filter.type}
      data-filter-value={props.filter.value}
      onClick={props.removeFilter}
    >
      {props.filter.value}

      <span className={styles.close}>
        <span>&times;</span>
      </span>
    </button>
  );
}

FilterTab.propTypes = {
  filter: PropTypes.object.isRequired,

  removeFilter: PropTypes.func.isRequired,
};

export default FilterTab;
