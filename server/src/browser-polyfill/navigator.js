const NOOP = () => {};

global.navigator = {
  onLine: false,

  serviceWorker: {
    controller: null,

    ready: {
      then: NOOP,
    },
  },

  share: NOOP,

  userAgent: '',

  vendor: '',
};
