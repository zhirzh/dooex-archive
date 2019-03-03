import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setSearch, resetSearch } from 'modules/search/reducer';

import NavIcon from 'components/NavIcon';
import ResetInputButton from 'components/ResetInputButton';

import styles from './SearchBar.scss';

class SearchBar extends React.Component {
  state = {
    searchText: this.props.searchText || '',
  };

  refInput = null;
  timeoutId = null;

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      nextState.searchText === this.state.searchText &&
      nextProps.searchText === this.props.searchText
    );
  }

  setRefInput = (input) => {
    this.refInput = input;
  };

  goBack = () => {
    this.props.router.push({
      ...this.props.location,
      pathname: '',
    });
  };

  updateSearchText(searchText) {
    clearTimeout(this.timeoutId);

    const newTimeoutId = setTimeout(this.updateSearchFilter, 1000);
    this.timeoutId = newTimeoutId;

    this.setState({ searchText });
  }

  updateSearchFilter = () => {
    const prevSearchText = this.props.searchText;
    const currSearchText = this.state.searchText;

    if (currSearchText === prevSearchText) {
      return;
    }

    if (currSearchText.length === 0) {
      this.props.resetSearch();
    } else {
      this.props.setSearch(currSearchText);
    }
  };

  handleFocus = (e) => {
    e.currentTarget.select();
  };

  handleChange = (e) => {
    this.updateSearchText(e.currentTarget.value);
  };

  resetSearchInput = () => {
    this.updateSearchText('');
    this.props.resetSearch();
    this.refInput.focus();
  };

  render() {
    return (
      <div className={styles.root}>
        <NavIcon icon="menu-left" onClick={this.goBack} />

        <div>
          <input
            ref={this.setRefInput}
            type="search"
            onFocus={this.handleFocus}
            onClick={this.handleFocus}
            onChange={this.handleChange}
            value={this.state.searchText}
          />

          <ResetInputButton
            onClick={this.resetSearchInput}
            isVisible={this.state.searchText.length > 0}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchText: state.search,
  };
}

const mapDispatchToProps = {
  setSearch,
  resetSearch,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBar));
