import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import detectMobileBrowser from 'detect-mobile-browser';

import {
  CountriesFilter,
  TypesFilter,
  FilterResetButton,
} from 'components';

import styles from './SideMenu.css';

const isMobileBrowser = detectMobileBrowser();

class SideMenu extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (isMobileBrowser) {
      document.body.classList.add('no-overflow');
    }
  }

  componentWillUnmount() {
    if (isMobileBrowser) {
      document.body.classList.remove('no-overflow');
    }
  }

  render() {
    let className;
    if (isMobileBrowser) {
      if (this.props.isVisible) {
        if (this.props.filtersCount > 0) {
          className = styles.mobileSpaced;
        } else {
          className = styles.mobile;
        }
      } else {
        className = styles.mobileHidden;
      }
    } else {
      className = styles.root;
    }

    return (
      <div
        className={className}
      >
        <h2>Filter</h2>

        <CountriesFilter />

        <TypesFilter />

        <FilterResetButton />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filtersCount: state.filters.length,
  };
}

export default connect(mapStateToProps)(SideMenu);
