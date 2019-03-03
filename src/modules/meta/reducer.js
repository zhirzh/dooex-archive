import fetchJson from 'modules/fetch-json';

import { UPDATE_DOODLE } from 'modules/doodles/reducer';

const GET_META_REQUEST = 'dooex/doodles/GET_META_REQUEST';
const GET_META_SUCCESS = 'dooex/doodles/GET_META_SUCCESS';
const GET_META_FAILURE = 'dooex/doodles/GET_META_FAILURE';

const savedDoodleIds = JSON.parse(window.localStorage.getItem('DOOEX-saved')) || [];
const initialState = {
  allCountries: [],
  allTags: [],
  allTypes: [],
  schema: [],
  sliceSize: -1,
  linkTypes: [],
  urlPrefixes: {},
  savedDoodleIds,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_META_SUCCESS:
      return {
        ...state,
        ...action.meta,
      };

    case UPDATE_DOODLE: {
      const savedDoodleIds = state.savedDoodleIds;
      const doodleId = action.doodle.id;

      if (savedDoodleIds.includes(doodleId)) {
        const doodleIdIdx = savedDoodleIds.findIndex(savedId => savedId === doodleId);

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
        savedDoodleIds: [
          ...savedDoodleIds,
          doodleId,
        ],
      };
    }

    default:
      return state;
  }
}

async function getMeta(dispatch) {
  dispatch({ type: GET_META_REQUEST });

  try {
    const meta = await fetchJson('./data/meta.json');
    dispatch({
      type: GET_META_SUCCESS,
      meta,
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_META_FAILURE,
      err,
    });

    return null;
  }
}

export {
  getMeta,
};

export default reducer;
