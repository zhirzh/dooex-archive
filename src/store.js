import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from 'modules/reducer';
import { UPDATE_DOODLE } from 'modules/doodles/reducer';

const customMiddleware = store => next => action => {
  next(action);

  if (action.type === UPDATE_DOODLE) {
    window.localStorage.setItem(
      'DOOEX-saved',
      JSON.stringify(store.getState().meta.savedDoodleIds)
    );
  }
};

const store = createStore(
  reducer,
  applyMiddleware(thunk, customMiddleware)
);

export default store;
