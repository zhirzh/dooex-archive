function detectPassive() {
  let passiveSupported = false;

  const options = Object.defineProperty({}, 'passive', {
    get() {
      passiveSupported = true;
    },
  });

  window.addEventListener('test', null, options);

  return passiveSupported;
}

export default detectPassive;
