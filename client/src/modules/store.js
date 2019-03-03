// @flow

import thunk from 'redux-thunk';

import { applyMiddleware, createStore } from 'redux';

import rootReducer from 'reducers/root-reducer';
import persistSavedDoodles from 'modules/persist-saved-doodles';
import syncLocation from 'modules/sync-location';

function createStoreWithState(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, persistSavedDoodles, syncLocation),
  );

  return store;
}

export default createStoreWithState;
