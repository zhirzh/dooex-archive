// @flow

import type { Dispatch } from 'modules/types';

import { fetchDoodlesSlice } from 'reducers/doodles';

type State = number;

type Action = { type: 'UPDATE_BATCH_SIZE' } | { type: 'RESET_BATCH_SIZE' };

const step = 5;

const initialState: State = step;

const UPDATE_BATCH_SIZE = 'UPDATE_BATCH_SIZE';
const RESET_BATCH_SIZE = 'RESET_BATCH_SIZE';

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_BATCH_SIZE:
      return state + step;

    case RESET_BATCH_SIZE:
      return initialState;

    default:
      return state;
  }
}

function resetBatchSize(): Action {
  return {
    type: RESET_BATCH_SIZE,
  };
}

function updateBatchSize(dispatch) {
  dispatch({
    type: UPDATE_BATCH_SIZE,
  });
}

function loadNextDoodles() {
  return async (dispatch: Dispatch, getState: Function) => {
    const offset = getState().infiniteScrollBatchSize;

    await fetchDoodlesSlice(dispatch, offset, step);

    updateBatchSize(dispatch);
  };
}

export { resetBatchSize, loadNextDoodles };

export default reducer;
