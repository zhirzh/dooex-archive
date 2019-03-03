import React from 'react';
import { connect } from 'react-redux';

import { addFilter, removeFilter } from 'modules/filters/reducer';

import styles from './TypesFilter.scss';

class TypesFilter extends React.Component {
  toggleTypeFilter = (e) => {
    if (e.currentTarget.checked) {
      this.props.addFilter({
        type: 'type',
        value: e.currentTarget.value,
      });
    } else {
      this.props.removeFilter({
        type: 'type',
        value: e.currentTarget.value,
      });
    }
  };

  isFilterActive = filterValue => this.props.filters.some(
      filter => filter.value === filterValue && filter.type === 'type',
    );

  render() {
    return (
      <div className="form-group">
        <strong>Types</strong>

        {this.props.allTypes.map(type =>
          (<div key={type} className="checkbox">
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
          </div>),
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(TypesFilter);
