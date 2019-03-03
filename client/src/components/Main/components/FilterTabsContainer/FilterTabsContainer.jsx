import React from 'react';

import FilterTab from './components/FilterTab';

import styles from './FilterTabsContainer.scss';

class FilterTabsContainer extends React.PureComponent {
  removeFilter = (e) => {
    this.props.removeFilter({
      type: e.currentTarget.dataset.filterType,
      value: e.currentTarget.dataset.filterValue,
    });
  };

  render() {
    return (
      <div className={styles.root}>
        {this.props.filters.map(filter =>
          <FilterTab key={filter.value} filter={filter} onClick={this.removeFilter} />,
        )}
      </div>
    );
  }
}

export default FilterTabsContainer;
