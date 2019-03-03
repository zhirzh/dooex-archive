import React from 'react';

import styles from './ResetInputButton.scss';

function ResetInputButton(props) {
  const className = props.isVisible ? styles.root : styles.hidden;

  return (
    <button className={className} onClick={props.onClick}>
      &times;
    </button>
  );
}

export default ResetInputButton;
