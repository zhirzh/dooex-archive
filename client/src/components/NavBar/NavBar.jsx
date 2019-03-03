// @flow

import React from 'react';
import Link from 'react-router-dom/Link';
import NavLink from 'react-router-dom/NavLink';

import AppInstallButton from './AppInstallButton';

import styles from './NavBar.css';

function shareApp() {
  navigator.share({
    title: 'DooEx',
    text: 'DooEx\nExplore Google Doodles\n\n',
    url: 'https://dooex.herokuapp.com/',
  });
}

function ShareButton() {
  if (navigator.share === undefined) {
    return null;
  }

  return (
    <button className={styles.action} onClick={shareApp}>
      <span className="fa fa-fw fa-share-alt" />
    </button>
  );
}

function NavBar() {
  return (
    <nav className={styles.root}>
      <Link className="navbar-brand" to="/">
        DooEx
      </Link>

      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className={styles.action} to="/search" activeClassName="active">
            <span className="fa fa-fw fa-search" />
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className={styles.action} to="/saved" activeClassName="active">
            <span className="fa fa-fw fa-star" />
          </NavLink>
        </li>

        <li className="nav-item">
          <AppInstallButton />
        </li>

        <li className="nav-item">
          <ShareButton />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
