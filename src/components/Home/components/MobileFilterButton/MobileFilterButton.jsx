import React from 'react';
import PropTypes from 'prop-types';

import detectMobileBrowser from 'detect-mobile-browser';

import styles from './MobileFilterButton.css';

const isMobileBrowser = detectMobileBrowser();

function MobileFilterButton(props) {
  if (isMobileBrowser === false) {
    return null;
  }

  return (
    <button
      className={props.isVisible
        ? styles.root
        : styles.hidden
      }
      onClick={props.onClick}
    >
      Filter
      {' '}
      <span
        className={props.isFilterVisible
          ? styles.showFilterIcon
          : styles.hideFilterIcon
        }
      />
    </button>
  );
}

MobileFilterButton.propTypes = {
  isFilterVisible: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,

  onClick: PropTypes.func.isRequired,
};

export default MobileFilterButton;
