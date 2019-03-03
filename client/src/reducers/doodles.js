// @flow

import type { Dispatch, Doodle, Meta } from 'modules/types';

import fetchJson from 'modules/fetch-json';
import inflate from 'modules/inflate-doodles';
import { fetchMeta } from 'reducers/meta';

type MetaState = Meta & {
  savedDoodleIds: Array<string>,
};

// $FlowFixMe
type State = Array<Doodle>;

type DeflatedDoodle = Array<any>;

type Action =
  | { type: 'FETCH_DOODLES', doodles: Array<DeflatedDoodle> }
  | { type: 'FETCH_DOODLES_SLICE', doodles: Array<DeflatedDoodle> }
  | { type: 'UPDATE_DOODLE', doodle: Doodle };

const initialState: State = [];

const FETCH_DOODLES = 'FETCH_DOODLES';
const FETCH_DOODLES_SLICE = 'FETCH_DOODLES_SLICE';
const UPDATE_DOODLE = 'UPDATE_DOODLE';

let allDoodlesLoaded = (async function checkAllDoodlesLoaded() {
  return !!await caches.match('/doodles/all');
}());

function reducer(state: State = initialState, action: Action, metaState: MetaState) {
  switch (action.type) {
    case FETCH_DOODLES:
      allDoodlesLoaded = true;
      return inflate(action.doodles, metaState);

    case FETCH_DOODLES_SLICE:
      return [...state, ...inflate(action.doodles, metaState)];

    case UPDATE_DOODLE: {
      const doodleIdx = state.findIndex(doodle => doodle.id === action.doodle.id);

      return [
        ...state.slice(0, doodleIdx),
        {
          ...action.doodle,
        },
        ...state.slice(doodleIdx + 1),
      ];
    }

    default:
      return state;
  }
}

async function fetchDoodles(dispatch) {
  const url = '/doodles/all';

  const doodles = await fetchJson(url);

  dispatch({
    type: FETCH_DOODLES,
    doodles,
  });
}

async function fetchDoodlesSlice(dispatch: Dispatch, offset: number, sliceSize: number) {
  // bail
  if (await allDoodlesLoaded) {
    return;
  }

  const url = `/doodles/slice/${offset}/${sliceSize}`;

  const doodles = await fetchJson(url);

  dispatch({
    type: FETCH_DOODLES_SLICE,
    doodles,
  });
}

function loadDoodles() {
  return async (dispatch: Dispatch) => {
    await fetchMeta(dispatch);

    await fetchDoodlesSlice(dispatch, 5, 5);

    fetchDoodles(dispatch);
  };
}

function updateDoodle(doodle: Doodle) {
  return {
    type: UPDATE_DOODLE,
    doodle,
  };
}

export { UPDATE_DOODLE, fetchDoodlesSlice, loadDoodles, updateDoodle };

export default reducer;
