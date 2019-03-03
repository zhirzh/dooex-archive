function confirmUpdate(sw) {
  const shouldContinue = window.confirm('Update ready\nContinue?');

  if (shouldContinue) {
    sw.postMessage({ action: 'skipWaiting' });
  }
}

function trackInstalling(sw) {
  sw.onstatechange = () => {
    if (sw.state === 'installed') {
      confirmUpdate(sw);
    }
  };
}

function checkPendingUpdate(reg) {
  let updateFound = false;

  if (reg.waiting) {
    confirmUpdate(reg.waiting);
    updateFound = true;
  }

  if (reg.installing) {
    trackInstalling(reg.installing);
    updateFound = true;
  }

  return updateFound;
}

async function installSW() {
  if (navigator.serviceWorker.controller !== null) {
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('./sw.js');
    const sw = reg.installing;

    if (sw === null) {
      return;
    }

    sw.onstatechange = () => {
      if (sw.state === 'activated') {
        alert('App installed');
        sw.postMessage({ action: 'control' });
      }
    };
  } catch (err) {
    console.error(err);
    alert('Install failed');
  }
}

async function updateSW() {
  if (navigator.serviceWorker.controller === null) {
    return;
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const updateFound = checkPendingUpdate(reg);
    if (updateFound === false) {
      reg.update();
    }
  } catch (err) {
    console.error(err);
    alert('Update failed');
  }
}

async function uninstallSW() {
  if (navigator.serviceWorker.controller === null) {
    return;
  }

  const shouldContinue = window.confirm('Uninstall?');

  if (shouldContinue === false) {
    return;
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const didUnregister = await reg.unregister();
    if (didUnregister) {
      alert('Uninstalled');
      window.location.reload();
    }
  } catch (err) {
    console.error(err);
    alert('Uninstall failed');
  }
}

async function initSW() {
  if (navigator.serviceWorker === undefined) {
    return;
  }

  navigator.serviceWorker.oncontrollerchange = () => window.location.reload();

  if (navigator.serviceWorker.controller === null) {
    if (window.isLoaded) {
      installSW();
      return;
    }

    window.addEventListener('load', installSW);
    return;
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    checkPendingUpdate(reg);
    reg.onupdatefound = () => trackInstalling(reg.installing);
  } catch (err) {
    console.error(err);
    alert('Something failed');
  }
}

initSW();

export {
  initSW,
  installSW,
  updateSW,
  uninstallSW,
};
