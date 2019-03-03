// @flow

import type { Doodle } from 'modules/types';

import React from 'react';

import InfoTable from './InfoTable';
import OnlineLink from 'components/OnlineLink';

import styles from './InfoModal.css';

type Props = {
  doodle: Doodle,
  close: Function,
};

function InfoModal(props: Props) {
  const { doodle } = props;

  const close = () => props.close('info');

  const bgClose = (e) => {
    if (e.target === e.currentTarget) {
      close('info');
    }
  };

  return (
    <div className={styles.root} onClick={bgClose}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <OnlineLink to={`https://www.google.com/doodles/${doodle.name}`} target="_blank">
                {doodle.title}

                <small className={styles.externalLink} />
              </OnlineLink>
            </h5>

            <button className="close" onClick={close}>
              <span>&times;</span>
            </button>
          </div>

          <div className={styles.body}>
            <InfoTable doodle={doodle} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
