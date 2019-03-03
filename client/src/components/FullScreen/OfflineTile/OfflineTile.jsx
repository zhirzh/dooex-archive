// @flow

import React from 'react';

import styles from './OfflineTile.css';

function OfflineTile() {
  return (
    <div className={styles.root}>
      <span className="fa fa-fw fa-4x fa-ban" />
      <br />
      <small>You are offline</small>
    </div>
  );
}

export default OfflineTile;
