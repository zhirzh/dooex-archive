import React from 'react';
import { Link } from 'react-router';

import styles from './NavIcon.scss';

function NavIcon(props) {
  return (
    <Link {...props} className={styles.root}>
      <span className={`glyphicon glyphicon-${props.icon}`} />
    </Link>
  );
}

export default NavIcon;
