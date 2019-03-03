import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { removeFilter } from 'modules/filters/reducer';

import { FilterTab } from 'components';

import styles from './FilterTabsContainer.css';

class FilterTabsContainer extends React.Component {
  static propTypes = {
    filters: PropTypes.array.isRequired,

    removeFilter: PropTypes.func.isRequired,
  };

  removeFilter = (e) => {
    this.props.removeFilter({
      type: e.currentTarget.dataset.filterType,
      value: e.currentTarget.dataset.filterValue,
    });
  };

  render() {
    return (
      <div
        className={
          this.props.filters.length === 0
            ? styles.hidden
            : styles.root
        }
      >
        {this.props.filters.map(filter => (
          <FilterTab
            key={filter.id}
            filter={filter}
            removeFilter={this.removeFilter}
          />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filters: state.filters,
  };
}

const mapDispatchToProps = {
  removeFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterTabsContainer);
