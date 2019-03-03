// @flow

import React from 'react';

import detectMobileBrowser from 'modules/detect-mobile-browser';

import AppInstallScreen from './AppInstallScreen';

import styles from '../NavBar.css';

const isMobileBrowser = detectMobileBrowser();

let installPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();

  installPrompt = e;

  return false;
});

function promptAppInstall() {
  if (installPrompt === null) {
    AppInstallScreen();

    return;
  }

  installPrompt.prompt();

  installPrompt.userChoice.then((choiceResult) => {
    console.log(choiceResult.outcome);

    if (choiceResult.outcome === 'dismissed') {
      console.log('User cancelled home screen install');
    } else {
      console.log('User added to home screen');
    }

    installPrompt = null;
  });
}

function AppInstallButton() {
  const isApp = new URL(window.location.href).searchParams.has('app');

  switch (true) {
    case isMobileBrowser === false:
    case window.BeforeInstallPromptEvent === undefined:
    case isApp:
      return null;

    default:
  }

  return (
    <button className={styles.action} onClick={promptAppInstall}>
      <span className="fa fa-fw fa-download" />
    </button>
  );
}

export default AppInstallButton;
