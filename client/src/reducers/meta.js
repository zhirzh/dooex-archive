// @flow

import type { Dispatch, Meta } from 'modules/types';

import { savedDoodleIdsLocalStorageKey } from 'modules/names';
import fetchJson from 'modules/fetch-json';
import { UPDATE_DOODLE } from 'reducers/doodles';

type State = Meta & {
  savedDoodleIds: Array<string>,
};

type Action = {
  type: 'FETCH_META',
  meta: State,
};

const initialState: State = {
  countries: [],
  linkTypes: [],
  schema: [],
  tags: [],
  urlPrefixes: {},

  savedDoodleIds: JSON.parse(window.localStorage.getItem(savedDoodleIdsLocalStorageKey)) || [],
};

const FETCH_META = 'meta/FETCH_META';

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_DOODLE: {
      const { savedDoodleIds } = state;

      const doodleId = action.doodle.id;

      if (savedDoodleIds.includes(doodleId)) {
        const doodleIdIdx = savedDoodleIds.findIndex(saveId => saveId === doodleId);

        return {
          ...state,

          savedDoodleIds: [
            ...savedDoodleIds.slice(0, doodleIdIdx),
            ...savedDoodleIds.slice(doodleIdIdx + 1),
          ],
        };
      }

      return {
        ...state,

        savedDoodleIds: [...savedDoodleIds, doodleId],
      };
    }

    case FETCH_META:
      return {
        ...state,

        ...action.meta,
      };

    default:
      return state;
  }
}

async function fetchMeta(dispatch: Dispatch) {
  try {
    const meta = await fetchJson('/doodles/meta');

    dispatch({
      type: FETCH_META,
      meta,
    });
  } catch (err) {
    console.error(err);
  }
}

export { fetchMeta };

export default reducer;
