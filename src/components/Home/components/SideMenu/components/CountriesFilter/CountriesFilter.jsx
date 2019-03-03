import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DataList } from 'components';

import { addFilter } from 'modules/filters/reducer';

import styles from './CountriesFilter.css';

function fuzzy(str) {
  return new RegExp(
    '^' + str.toLowerCase().split('').concat('').join('.*'),
    'gm'
  );
}

class CountriesFilter extends React.Component {
  static propTypes = {
    allCountries: PropTypes.array.isRequired,
    filters: PropTypes.array.isRequired,

    addFilter: PropTypes.func.isRequired,
  };

  state = {
    countryInput: '',
    isDataListVisible: false,
  };

  ref = null;
  refInput = null;

  addCountryToFilters = (e) => {
    const filterValue = e.currentTarget.value;

    if (filterValue === '') {
      return;
    }

    this.props.addFilter({
      type: 'country',
      value: filterValue,
    });

    this.setState({ countryInput: '' });
    this.refInput.focus();
  };

  showDataList = () => {
    this.setState({ isDataListVisible: true });
  };

  hideDataList = (e) => {
    if (
      e.relatedTarget === null ||
      e.relatedTarget.parentNode.parentNode !== this.ref
    ) {
      this.setState({
        isDataListVisible: false,
        countryInput: '',
      });
    }
  };

  foo = () => {
    const filteredCountries = this.props.filters
      .filter(filter => filter.type === 'country')
      .map(filter => filter.value);

    return this.props.allCountries
      .filter(country => fuzzy(this.state.countryInput).test(country))
      .filter(country => !(filteredCountries.includes(country)))
      .slice(0, 10);
  };

  updateCountryInput = (e) => {
    this.setState({ countryInput: e.currentTarget.value });
  };

  render() {
    return (
      <div
        className="form-group"
        style={{position: 'relative'}}
        ref={div => this.ref = div}
        onBlur={this.hideDataList}
      >
        <label htmlFor="filter-countries">Countries</label>

        {/*
        <select
          id="filter-countries"
          className={styles.select}
          onChange={this.addCountryToFilters}
        >
          <option value="">Select Country</option>

          {this.props.allCountries.map(country => (
            <option key={country} className={styles.option}>
              {country}
            </option>
          ))}
        </select>
        */}

        <input
          id="filter-countries"
          type="text"
          className={styles.select}
          placeholder="Countries"
          value={this.state.countryInput}
          ref={input => this.refInput = input}

          onInput={this.updateCountryInput}
          onFocus={this.showDataList}
        />

        <DataList
          isVisible={this.state.isDataListVisible}
          countries={this.foo()}
          addCountryToFilters={this.addCountryToFilters}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allCountries: state.meta.allCountries,
    filters: state.filters,
  };
}

const mapDispatchToProps = {
  addFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(CountriesFilter);
