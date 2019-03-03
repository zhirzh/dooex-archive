import React from 'react';

import styles from './Hint.scss';

function Hint(props) {
  return (
    <div className={styles.root} data-hint={props.hint}>
      {props.children}
    </div>
  );
}

export default Hint;
