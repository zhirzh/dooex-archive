import React from 'react';
import { connect } from 'react-redux';

import { removeFilter } from 'modules/filters/reducer';

import styles from './FilterTab.scss';

class FilterTab extends React.Component {
  removeFilter = () => {
    this.props.removeFilter(this.props.filter);
  };

  render() {
    return (
      <button className={styles.root} onClick={this.removeFilter}>
        {this.props.filter.value}

        <span className={styles.close}>&times;</span>
      </button>
    );
  }
}

const mapDispatchToProps = {
  removeFilter,
};

export default connect(null, mapDispatchToProps)(FilterTab);
