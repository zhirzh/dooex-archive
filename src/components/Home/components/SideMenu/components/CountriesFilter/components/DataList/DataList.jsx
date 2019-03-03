import React from 'react';

import styles from './DataList.css';

class DataList extends React.Component {
  render() {
    if (this.props.isVisible === false) {
      return null;
    }

    return (
      <div className={styles.root}>
        {this.props.countries.map(country => (
          <button
            key={country}
            type="button"
            onClick={this.props.addCountryToFilters}
            className={styles.option}
            value={country}
          >
            {country}
          </button>
        ))}
      </div>
    );
  }
}

export default DataList;
