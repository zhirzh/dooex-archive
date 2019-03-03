import React from 'react';

import CountriesFilter from './components/CountriesFilter';
import FilterResetButton from './components/FilterResetButton';
import TypesFilter from './components/TypesFilter';
import DateFilter from './components/DateFilter';

import styles from './FilterPanel.scss';

class FilterPanel extends React.PureComponent {
  render() {
    const className = this.props.isVisible ? styles.root : styles.hidden;

    return (
      <div className={className}>
        <h2>Filter</h2>

        <CountriesFilter />

        <TypesFilter />

        <DateFilter />

        <FilterResetButton />
      </div>
    );
  }
}

export default FilterPanel;
