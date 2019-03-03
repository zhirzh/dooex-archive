/*
  Due to lack of actual server,
  some `hacks` have been made to streamline server-side-rendering,
  while keeping everything as-is

  `window.location` and `window.localStorage` are absent
  in pure `node` environment (because `window` global is absent)

  Thus, this.
*/

const polyfill = {};

if (typeof window !== 'undefined') {
  polyfill.localStorage = window.localStorage;
} else {
  polyfill.localStorage = {
    setItem(k, v) {
      console.log('SET-ITEM:', k, v);
      return null;
    },

    getItem(k) {
      console.log('GET-ITEM:', k);
      return null;
    },
  };
}

export default polyfill;
