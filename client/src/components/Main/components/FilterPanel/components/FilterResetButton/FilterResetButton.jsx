import React from 'react';
import { connect } from 'react-redux';

import { resetFilter } from 'modules/filters/reducer';

import styles from './FilterResetButton.scss';

function FilterResetButton(props) {
  return (
    <button className={styles.root} onClick={props.resetFilter}>
      Reset
    </button>
  );
}

const mapDispatchToProps = { resetFilter };

export default connect(null, mapDispatchToProps)(FilterResetButton);
