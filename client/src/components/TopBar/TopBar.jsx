import React from 'react';
import { Link, withRouter } from 'react-router';

import NavIcon from 'components/NavIcon';

import styles from './TopBar.scss';

function SavedIcon(onSavedPage) {
  return (
    <NavIcon
      to={onSavedPage ? '/' : '/saved'}
      icon={onSavedPage ? 'floppy-saved' : 'floppy-disk'}
    />
  );
}

function TopBar(props) {
  const onSavedPage = props.location.pathname === '/saved';

  return (
    <div className={styles.root}>
      <Link to="/">
        <img alt="Logo" src="/favicon.ico" />
      </Link>

      <div className="pull-right">
        <NavIcon to="/search" icon="search" />
        <NavIcon to="/time-travel" icon="time" />
        {SavedIcon(onSavedPage)}
      </div>
    </div>
  );
}

export default withRouter(TopBar);
