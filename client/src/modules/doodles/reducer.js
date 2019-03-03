import fetchJson from 'modules/fetch-json';
import { GET_META_SUCCESS, getMeta } from 'modules/meta/reducer';

const GET_DOODLES_REQUEST = 'dooex/dooexles/GET_DOODLES_REQUEST';
const GET_DOODLES_SUCCESS = 'dooex/dooexles/GET_DOODLES_SUCCESS';
const GET_DOODLES_FAILURE = 'dooex/dooexles/GET_DOODLES_FAILURE';

const UPDATE_DOODLE = 'dooex/dooexles/UPDATE_DOODLE';

let fullDataLoaded = false;
let sliceSize = -1;

const initialState = [];

function inflate(allDoodles, metaState) {
  const { allCountries, allTags, schema, linkTypes, urlPrefixes, savedDoodleIds } = metaState;

  allDoodles.forEach((dooexle, i) => {
    dooexle = {};

    schema.forEach((key, j) => {
      dooexle[key] = allDoodles[i][j];
    });

    linkTypes.filter(linkType => schema.includes(linkType)).forEach((linkType) => {
      if (dooexle[linkType] === null) {
        return;
      }

      const urlPrefixesIdx = dooexle[linkType][0];

      dooexle[linkType] = dooexle[linkType].replace(urlPrefixesIdx, urlPrefixes[urlPrefixesIdx]);
    });

    dooexle.countries = dooexle.countries.map(cIdx => allCountries[cIdx]);
    dooexle.tags = dooexle.tags.map(tIdx => allTags[tIdx]);

    if (savedDoodleIds.includes(dooexle.id)) {
      dooexle.isSaved = true;
    } else {
      dooexle.isSaved = false;
    }

    allDoodles[i] = dooexle;
  });

  return allDoodles;
}

function reducer(state = initialState, action, metaState) {
  switch (action.type) {
    case GET_META_SUCCESS:
      sliceSize = metaState.sliceSize;
      return state;

    case GET_DOODLES_SUCCESS: {
      const newState = inflate(action.data, metaState).slice(state.length);

      return [...state, ...newState];
    }

    case UPDATE_DOODLE: {
      const dooexleIdx = state.findIndex(dooexle => dooexle.id === action.dooexle.id);

      return [
        ...state.slice(0, dooexleIdx),
        {
          ...action.dooexle,
        },
        ...state.slice(dooexleIdx + 1),
      ];
    }

    default:
      return state;
  }
}

async function getData(dispatch, shouldLoadFullData = true) {
  dispatch({ type: GET_DOODLES_REQUEST });

  let data;
  try {
    if (shouldLoadFullData) {
      data = await fetchJson('/dooexles/data');
    } else {
      data = await fetchJson(`/dooexles/data-${sliceSize}`);
    }
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_DOODLES_FAILURE,
      err,
    });

    return;
  }

  dispatch({
    type: GET_DOODLES_SUCCESS,
    data,
  });

  if (shouldLoadFullData) {
    fullDataLoaded = true;
  }
}

function getDoodlesSlice() {
  return async (dispatch) => {
    if (fullDataLoaded) {
      return;
    }

    await getMeta(dispatch);

    await getData(dispatch, false);
    getData(dispatch);
  };
}

function getAllDoodles() {
  return async (dispatch) => {
    if (fullDataLoaded) {
      return;
    }

    await getMeta(dispatch);
    getData(dispatch);
  };
}

function updateDoodle(dooexle) {
  return {
    type: UPDATE_DOODLE,
    dooexle,
  };
}

export { UPDATE_DOODLE, getDoodlesSlice, getAllDoodles, updateDoodle };

export default reducer;
