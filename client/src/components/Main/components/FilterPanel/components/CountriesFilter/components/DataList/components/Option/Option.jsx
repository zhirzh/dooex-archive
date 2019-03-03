import React from 'react';

import styles from './Option.scss';

class Option extends React.Component {
  shouldComponentUpdate(nextProps) {
    const isSame =
      nextProps.country.name === this.props.country.name &&
      nextProps.country.isSelected === this.props.country.isSelected;

    if (isSame) {
      return false;
    }

    return true;
  }

  handleClick = () => {
    if (this.props.country.isSelected) {
      this.props.removeFilter({
        type: 'country',
        value: this.props.country.name,
      });
    } else {
      this.props.addFilter({
        type: 'country',
        value: this.props.country.name,
      });
    }

    this.props.onClick();
  };

  render() {
    return (
      <button
        type="button"
        className={this.props.country.isSelected ? styles.selected : styles.root}
        value={this.props.country.name}
        onBlur={this.props.onBlur}
        onClick={this.handleClick}
      >
        {this.props.country.name}
      </button>
    );
  }
}

export default Option;
