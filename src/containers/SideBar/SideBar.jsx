import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { basename } from 'routes';

import styles from 'styles/SideBar.scss';

class SideBar extends Component {
  constructor() {
    super();

    this.countriesDatalist = null;

    // TODO: remove refs
    this.Refs = {};

    this.updateFilter = this.updateFilter.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateType = this.updateType.bind(this);
    this.resetCountry = this.resetCountry.bind(this);
    this.renderCountriesDatalist = this.renderCountriesDatalist.bind(this);
  }

  componentDidMount() {
    this.Refs['filter-country'].value = this.props.filter.country || '';
    this.Refs[`filter-type[${this.props.filter.type || 'all'}]`].checked = true;

    this.Refs['reset-country'].style.display = this.props.filter.country ? 'block' : 'none';
  }

  componentDidUpdate() {
    this.Refs['filter-country'].value = this.props.filter.country || '';
    this.Refs[`filter-type[${this.props.filter.type || 'all'}]`].checked = true;

    this.Refs['reset-country'].style.display = this.props.filter.country ? 'block' : 'none';
  }

  updateFilter(key, value) {
    this.props.router.push({
      pathname: basename,
      query: {
        ...this.props.filter,
        [key]: value,
      },
    });
  }

  updateCountry(e) {
    const isValidInput = Array.from(this.countriesDatalist.children)
      .map(option => option.value.toLowerCase())
      .includes(e.target.value.toLowerCase());

    if (isValidInput) {
      this.updateFilter('country', e.target.value);
    }
  }

  updateType(e) {
    if (e.target.checked) {
      this.updateFilter('type', e.target.value || undefined);
    }
  }

  resetCountry() {
    this.updateFilter('country', undefined);
  }

  renderCountriesDatalist() {
    return (
      <datalist id="countries-datalist" ref={dl => (this.countriesDatalist = dl)}>
        {this.props.countries.map((c, i) => (
          <option key={i} value={c} />
        ))}
      </datalist>
    );
  }

  render() {
    const classNames = this.props.className.split(' ');
    if (this.props.isMobileMenuHidden) {
      classNames.push('hidden-xs-down');
    } else {
      classNames.push(styles.mobileMenu);
    }

    return (
      <aside className={classNames.join(' ')} id={styles.sidebar}>
        <div>
          <div className="form-group">
            <h4>Filter</h4>

            <hr />
          </div>

          <div className="form-group">
            <strong>Country</strong>

            <div className={styles.textInputContainer}>
              <input
                type="text"
                className="form-control"
                id="filter-country"
                ref={x => (this.Refs['filter-country'] = x)}
                list="countries-datalist"
                onChange={this.updateCountry}
              />

              <button
                className={styles.clear}
                onClick={this.resetCountry}
                ref={x => (this.Refs['reset-country'] = x)}
              >
                &times;
              </button>
            </div>

            {this.renderCountriesDatalist()}

            <hr />
          </div>

          <div className="form-group">
            <strong>Doodle type</strong>

            <div className="form-check">
              <div className="custom-controls-stacked">
                <label className="custom-control custom-radio" htmlFor="filter-type[all]">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="filter-type"
                    id="filter-type[all]"
                    ref={x => (this.Refs['filter-type[all]'] = x)}
                    value=""
                    onChange={this.updateType}
                  />
                  <span className="custom-control-indicator" />
                  All
                </label>

                <label className="custom-control custom-radio" htmlFor="filter-type[simple]">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="filter-type"
                    id="filter-type[simple]"
                    ref={x => (this.Refs['filter-type[simple]'] = x)}
                    value="simple"
                    onChange={this.updateType}
                  />
                  <span className="custom-control-indicator" />
                  Simple
                </label>

                <label className="custom-control custom-radio" htmlFor="filter-type[animated]">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="filter-type"
                    id="filter-type[animated]"
                    ref={x => (this.Refs['filter-type[animated]'] = x)}
                    value="animated"
                    onChange={this.updateType}
                  />
                  <span className="custom-control-indicator" />
                  Animated
                </label>

                <label className="custom-control custom-radio" htmlFor="filter-type[interactive]">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name="filter-type"
                    id="filter-type[interactive]"
                    ref={x => (this.Refs['filter-type[interactive]'] = x)}
                    value="interactive"
                    onChange={this.updateType}
                  />
                  <span className="custom-control-indicator" />
                  Interactive
                </label>
              </div>

              <div className="clearfix" />

              <hr />
            </div>
          </div>
        </div>
      </aside>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  countries: state.doodles.countries,
  filter: ownProps.location.query,
});

export default withRouter(connect(mapStateToProps)(SideBar));
