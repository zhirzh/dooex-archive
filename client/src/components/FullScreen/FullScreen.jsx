// @flow

import type { Doodle } from 'modules/types';

import React, { Component } from 'react';

import OfflineTile from './OfflineTile';

import styles from './FullScreen.css';

type Props = {
  doodle: Doodle,
  close: Function,
};

function renderIframe(doodle: Doodle) {
  // Replace origin to convert remote URL into self-hosted URL
  // so that service-worker can `fetch` it

  const url = new URL(doodle.standalone_html);
  const src = url.href.replace(url.origin, '');

  return <iframe className={styles.iframe} src={src} title={doodle.title} />;
}

function renderImage(doodle: Doodle) {
  const windowAspect = window.screen.width / window.screen.height;

  return (
    <img
      className={windowAspect > doodle.aspect ? styles.landscape : styles.portrait}
      src={doodle.isSaved ? `/saved?${doodle.high_res_url}` : doodle.high_res_url}
      alt={doodle.title}
    />
  );
}

function renderDoodle(doodle: Doodle) {
  if (navigator.onLine === false && doodle.isSaved === false) {
    return <OfflineTile />;
  }

  switch (doodle.type) {
    case 'interactive':
      return renderIframe(doodle);

    default:
      return renderImage(doodle);
  }
}

function FullScreen(props: Props) {
  const { close, doodle } = props;

  return (
    <div className={styles.root}>
      {renderDoodle(doodle)}

      <div className={styles.closeContainer}>
        <button className={styles.close} onClick={() => close('fullscreen')}>
          <span>&times;</span>
        </button>
      </div>
    </div>
  );
}

export default FullScreen;
