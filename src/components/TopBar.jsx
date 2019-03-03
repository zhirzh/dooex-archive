import React from 'react';
import { Link } from 'react-router';

import { basename } from 'routes';

import styles from 'styles/TopBar.scss';

const TopBar = ({ toggleMobileMenu }) => (
  <div>
    <nav className="navbar navbar-light bg-faded" id={styles.topbar}>
      <button className="navbar-toggler float-xs-left hidden-sm-up" onClick={toggleMobileMenu} />
      <div className="text-xs-center" style={{ marginTop: '5px' }}>
        <Link
          className="navbar-brand float-xs-none hidden-sm-up"
          to={basename}
          title="DooEx - Google doodles gallery"
        >
          DooEx
        </Link>

        <div className="nav navbar-nav float-xs-right hidden-sm-up">
          <Link
            className="nav-item nav-link"
            to={{
              pathname: basename,
              query: { saved: true },
            }}
          >
            Saved
          </Link>
        </div>
      </div>

      <Link
        className="navbar-brand hidden-xs-down"
        to={basename}
        title="DooEx - Google doodles gallery"
      >
        DooEx
      </Link>
      <div className="nav navbar-nav float-xs-right hidden-xs-down">
        <Link
          className="nav-item nav-link"
          to={{
            pathname: basename,
            query: { saved: true },
          }}
        >
          Saved
        </Link>
      </div>
    </nav>
  </div>
);

export default TopBar;
