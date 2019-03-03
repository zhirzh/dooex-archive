import React from 'react';

import detectMobileBrowser from 'modules/detect-mobile-browser';

import styles from './Iframe.scss';

function getRequestFullscreen() {
  const el = document.body;

  const requestFullscreen =
    el.requestFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen ||
    el.webkitRequestFullscreen;

  return requestFullscreen.bind(el);
}

function getExitFullscreen() {
  const exitFullscreen =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;

  return exitFullscreen.bind(document);
}

function isFullscreen() {
  const isFullscreen =
    document.isFullscreen ||
    document.mozFullScreen ||
    document.msFullScreen ||
    document.webkitIsFullScreen;

  return isFullscreen;
}

function addFullscreenchangeListener(fn) {
  let event;
  switch (true) {
    case 'onfullscreenchange' in document:
      event = 'fullscreenchange';
      break;

    case 'onmozfullscreenchange' in document:
      event = 'mozfullscreenchange';
      break;

    case 'MSFullscreenChange' in document:
      event = 'MSFullscreenChange';
      break;

    case 'onwebkitfullscreenchange' in document:
      event = 'webkitfullscreenchange';
      break;

    default:
      throw Error();
  }

  return document.addEventListener(event, fn);
}

function removeFullscreenchangeListener(fn) {
  let event;
  switch (true) {
    case 'onfullscreenchange' in document:
      event = 'fullscreenchange';
      break;

    case 'onmozfullscreenchange' in document:
      event = 'mozfullscreenchange';
      break;

    case 'MSFullscreenChange' in document:
      event = 'MSFullscreenChange';
      break;

    case 'onwebkitfullscreenchange' in document:
      event = 'webkitfullscreenchange';
      break;

    default:
      throw Error();
  }

  return document.removeEventListener(event, fn);
}

function getLockOrientation() {
  const oldLockOrientation =
    screen.lockOrientation ||
    screen.mozLockOrientation ||
    screen.msLockOrientation ||
    screen.webkitLockOrientation;

  const newLockOrientation = screen.orientation.lock;

  const lockOrientation = oldLockOrientation || newLockOrientation;

  const el = newLockOrientation ? screen.orientation : screen;

  return lockOrientation.bind(el, 'landscape');
}

function getUnlockOrientation() {
  const oldUnlockOrientation =
    screen.unlockOrientation ||
    screen.mozUnlockOrientation ||
    screen.msUnlockOrientation ||
    screen.webkitUnlockOrientation;

  const newUnlockOrientation = screen.orientation.unlock;

  const unlockOrientation = oldUnlockOrientation || newUnlockOrientation;

  const el = newUnlockOrientation ? screen.orientation : screen;

  return unlockOrientation.bind(el);
}

function toggleOrientation() {
  const lockOrientation = getLockOrientation();
  const unlockOrientation = getUnlockOrientation();

  if (isFullscreen()) {
    lockOrientation();
  } else {
    unlockOrientation();
  }
}

const isMobile = detectMobileBrowser();

class Iframe extends React.Component {
  componentWillMount() {
    if (isMobile === false) {
      return;
    }

    const requestFullscreen = getRequestFullscreen();

    addFullscreenchangeListener(toggleOrientation);
    requestFullscreen();
  }

  componentWillUnmount() {
    if (isMobile === false) {
      return;
    }

    const exitFullscreen = getExitFullscreen();

    removeFullscreenchangeListener(toggleOrientation);
    exitFullscreen();
  }

  render() {
    const url = new URL(this.props.doodle.standaloneHtml);

    return (
      <iframe
        className={styles.root}
        src={url.href.replace(url.origin, '')}
        title={this.props.doodle.title}
      />
    );
  }
}

export default Iframe;
