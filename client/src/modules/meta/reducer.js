import fetchJson from 'modules/fetch-json';
import { UPDATE_DOOEXLE } from 'modules/dooexles/reducer';

const GET_META_REQUEST = 'dooex/dooexles/GET_META_REQUEST';
const GET_META_SUCCESS = 'dooex/dooexles/GET_META_SUCCESS';
const GET_META_FAILURE = 'dooex/dooexles/GET_META_FAILURE';

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

    case UPDATE_DOOEXLE: {
      const savedDoodleIds = state.savedDoodleIds;
      const dooexleId = action.dooexle.id;

      if (savedDoodleIds.includes(dooexleId)) {
        const dooexleIdIdx = savedDoodleIds.findIndex(savedId => savedId === dooexleId);

        return {
          ...state,
          savedDoodleIds: [
            ...savedDoodleIds.slice(0, dooexleIdIdx),
            ...savedDoodleIds.slice(dooexleIdIdx + 1),
          ],
        };
      }

      return {
        ...state,
        savedDoodleIds: [...savedDoodleIds, dooexleId],
      };
    }

    default:
      return state;
  }
}

async function getMeta(dispatch) {
  dispatch({ type: GET_META_REQUEST });

  try {
    const meta = await fetchJson('/dooexles/meta');
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
  }
}

export { GET_META_SUCCESS, getMeta };

export default reducer;
