function noop() {}

function detectPassive() {
  let passiveSupported = false;

  const options = Object.defineProperty({}, 'passive', {
    get() {
      passiveSupported = true;
    },
  });

  window.addEventListener('detect-passive', noop, options);
  window.removeEventListener('detect-passive', noop, options);

  return passiveSupported;
}

export default detectPassive;
