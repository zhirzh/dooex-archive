import { UPDATE_DOODLE } from 'reducers/doodles';

import { savedDoodleIdsLocalStorageKey } from 'modules/names';

const persistSavedDoodles = store => next => (action) => {
  const result = next(action);

  if (action.type === UPDATE_DOODLE) {
    window.localStorage.setItem(
      savedDoodleIdsLocalStorageKey,
      JSON.stringify(store.getState().meta.savedDoodleIds),
    );
  }

  return result;
};

export default persistSavedDoodles;
