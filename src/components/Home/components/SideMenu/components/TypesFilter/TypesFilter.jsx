import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  addFilter,
  removeFilter,

  stringify,
} from 'modules/filters/reducer';

import styles from './TypesFilter.css';

class TypesFilter extends React.Component {
  static propTypes = {
    allTypes: PropTypes.array.isRequired,
    filters: PropTypes.array.isRequired,

    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.updateLocationSearch();
  }

  componentDidUpdate() {
    this.updateLocationSearch();
  }

  updateLocationSearch() {
    this.props.history.replace({
      ...this.props.location,
      search: stringify(this.props.filters),
    });
  }

  toggleTypeFilter = (e) => {
    if (e.currentTarget.checked) {
      this.props.addFilter({
        type: 'type',
        value: e.currentTarget.value
      });
    } else {
      this.props.removeFilter({
        type: 'type',
        value: e.currentTarget.value,
      });
    }
  };

  isFilterActive = (filterValue) => {
    return this.props.filters.some(
      filter => (filter.value === filterValue) && (filter.type === 'type')
    );
  };

  render() {
    return (
      <div className="form-group">
        <strong>Types</strong>

        {this.props.allTypes.map(type => (
          <div key={type} className="checkbox">
            <label htmlFor={`filter-${type}`} className={styles.label}>
              <input
                type="checkbox"
                id={`filter-${type}`}
                value={type}
                onChange={this.toggleTypeFilter}
                checked={this.isFilterActive(type)}
              />
              {type}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allTypes: state.meta.allTypes,
    filters: state.filters,
  };
}

const mapDispatchToProps = {
  addFilter,
  removeFilter,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TypesFilter));
