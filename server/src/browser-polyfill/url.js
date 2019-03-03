const NOOP = () => {};

global.URL = class URL {
  constructor() {
    this.hash = '';
    this.host = '';
    this.hostname = '';
    this.href = '';
    this.origin = '';
    this.password = '';
    this.pathname = '';
    this.port = '';
    this.protocol = '';
    this.search = '';
    this.username = '';

    this.searchParams = {
      delete: NOOP,
      get: NOOP,
      has: NOOP,
      set: NOOP,
    };
  }
};
