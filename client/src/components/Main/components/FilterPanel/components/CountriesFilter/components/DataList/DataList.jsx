import React from 'react';
import { connect } from 'react-redux';

import { addFilter, removeFilter } from 'modules/filters/reducer';

import Option from './components/Option';

import styles from './DataList.scss';

class DataList extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return (
  //     // !(nextProps.allCountries === this.props.allCountries)
  //     // ||
  //     // !(nextProps.countryInput === this.props.countryInput)
  //     // ||
  //     // !(nextProps.filters === this.props.filters)
  //     // ||
  //     // !(nextProps.isVisible === this.props.isVisible)
  //   );
  // }

  inputCountries = () => {
    const filterCountries = this.props.filters
      .filter(filter => filter.type === 'country')
      .map(filter => filter.value);

    const globbedCountryInput = this.props.countryInput.toLowerCase().split('').join('.*');
    const fuzzyInput = new RegExp(`^${globbedCountryInput}`);

    return this.props.allCountries
      .filter(country => fuzzyInput.test(country))
      .slice(0, 10)
      .map(country => ({
        name: country,
        isSelected: filterCountries.includes(country),
      }));
  };

  render() {
    const className = this.props.isVisible ? styles.root : styles.hidden;

    return (
      <div className={className} ref={this.props.setRef}>
        {this.inputCountries().map(country =>
          (<Option
            key={country.name}
            country={country}
            onBlur={this.props.onBlur}
            onClick={this.props.onClick}
            addFilter={this.props.addFilter}
            removeFilter={this.props.removeFilter}
          />),
        )}
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
  removeFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
