import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { resetFilter } from 'modules/filters/reducer';

import styles from './FilterResetButton.css';

function FilterResetButton(props) {
  return (
    <button
      className={styles.root}
      onClick={props.resetFilter}
      aria-label="Reset Filter"
    >
      Reset
    </button>
  );
}

FilterResetButton.propTypes = {
  resetFilter: PropTypes.func.isRequired,
};

const mapDispatchToProps = { resetFilter };

export default connect(null, mapDispatchToProps)(FilterResetButton);
