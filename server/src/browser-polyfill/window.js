const NOOP = () => {};

global.window = {
  addEventListener: NOOP,

  BeforeInstallPromptEvent: null,

  innerHeight: 0,

  localStorage: {
    getItem: () => null,
    setItem: NOOP,
  },

  location: {
    hostname: '',
    href: '',
    origin: '',
    reload: NOOP,
  },

  opera: '',

  removeEventListener: NOOP,

  screen: {
    height: 0,
    width: 0,
  },
};
