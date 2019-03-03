import React from 'react';

import ResetInputButton from 'components/ResetInputButton';

import DataList from './components/DataList';

import styles from './CountriesFilter.scss';

class CountriesFilter extends React.PureComponent {
  state = {
    countryInput: '',
    isDataListVisible: false,
  };

  refDataList = null;
  refInput = null;

  focusCountryInput = () => {
    this.refInput.focus();
  };

  resetCountryInput = () => {
    this.updateCountryInput('');
    this.focusCountryInput();
  };

  hideDataList = () => {
    this.setState({ isDataListVisible: false });
  };

  showDataList = () => {
    this.setState({ isDataListVisible: true });
  };

  handleFocus = (e) => {
    if (this.state.isDataListVisible) {
      return;
    }

    this.showDataList();
  };

  handleBlur = (e) => {
    const elementFocused = e.relatedTarget;

    if (elementFocused === null) {
      this.hideDataList();
      return;
    }

    if (
      !this.refDataList.contains(elementFocused) &&
      !(elementFocused.parentNode === e.currentTarget.parentNode) &&
      !(elementFocused === this.refInput)
    ) {
      this.setState({ isDataListVisible: false });
    }
  };

  setRefDataList = (div) => {
    this.refDataList = div;
  };

  setRefInput = (input) => {
    this.refInput = input;
  };

  updateCountryInput(value) {
    this.setState({ countryInput: value });
  }

  handleInput = (e) => {
    this.updateCountryInput(e.currentTarget.value);
  };

  render() {
    return (
      <div className={styles.root}>
        <label htmlFor="filter-countries">Countries</label>

        <div>
          <input
            id="filter-countries"
            type="text"
            className={styles.select}
            placeholder="Countries"
            value={this.state.countryInput}
            ref={this.setRefInput}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onInput={this.handleInput}
          />

          <ResetInputButton
            isVisible={this.state.countryInput.length > 0}
            onClick={this.resetCountryInput}
          />
        </div>

        <DataList
          setRef={this.setRefDataList}
          isVisible={this.state.isDataListVisible}
          countryInput={this.state.countryInput}
          onBlur={this.handleBlur}
          onClick={this.focusCountryInput}
        />
      </div>
    );
  }
}

export default CountriesFilter;
