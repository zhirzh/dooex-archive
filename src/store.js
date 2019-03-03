import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from 'modules/reducer';

import polyfill from 'browser-polyfill';

const store = createStore(reducer, applyMiddleware(thunk));

store.subscribe(() => {
  const savedDoodles = store.getState().doodles.doodles
    .filter(d => d.isSaved)
    .map(d => d.id);

  if (savedDoodles.length === 0) {
    return;
  }

  polyfill.localStorage.setItem(
    'saved-doodles',
    JSON.stringify(savedDoodles),
  );
});

export default store;
