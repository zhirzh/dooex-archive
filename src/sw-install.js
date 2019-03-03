function requestUpdate(sw) {
  const shouldUpdate = window.confirm('New version available. Update?');
  if (shouldUpdate) {
    sw.postMessage({ shouldUpdate: true });
  }
}

function checkStateForInstalled(sw) {
  sw.addEventListener('statechange', () => {
    if (sw.state === 'installed') {
      requestUpdate(sw);
    }
  });
}

navigator.serviceWorker.register('./sw.js').then((reg) => {
  if (!navigator.serviceWorker.controller) {
    return;
  }

  if (reg.waiting) {
    requestUpdate(reg.waiting);
    return;
  }

  if (reg.installing) {
    checkStateForInstalled(reg.installing);
    return;
  }

  reg.addEventListener('updatefound', () => {
    checkStateForInstalled(reg.installing);
  });
});

navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
