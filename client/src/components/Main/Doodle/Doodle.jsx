// @flow

import type { Location } from 'react-router';

import type { Doodle as DoodleType } from 'modules/types';

import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import withRouter from 'react-router/withRouter';

import OnlineLink from 'components/OnlineLink';
import SaveButton from './SaveButton';
import Tile from './Tile';

import styles from './Doodle.css';

type Props = {
  basepath: string,
  doodle: DoodleType,
  location: Location,
};

class Doodle extends Component<Props> {
  modalPathname(modalType) {
    return {
      ...this.props.location,

      pathname: `${this.props.basepath}/${modalType}/${this.props.doodle.id}`,
      state: { isModal: true },
    };
  }

  render() {
    const { doodle } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.actions}>
            <Link className="btn" to={this.modalPathname('info')}>
              <span className="fa fa-fw fa-info" />
            </Link>

            <SaveButton doodle={doodle} />
          </div>

          <h5 className={styles.title}>{doodle.title}</h5>
        </div>

        <OnlineLink
          force={this.props.doodle.isSaved}
          to={this.modalPathname('fullscreen')}
          className={styles.tileLink}
        >
          <Tile src={doodle.url} title={doodle.title} />
        </OnlineLink>
      </div>
    );
  }
}

export default withRouter(Doodle);
