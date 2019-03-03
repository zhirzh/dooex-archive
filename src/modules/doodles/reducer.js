import fetchJson from 'modules/fetch-json';
import { getMeta } from 'modules/meta/reducer';

const GET_DOODLES_REQUEST = 'dooex/doodles/GET_DOODLES_REQUEST';
const GET_DOODLES_SUCCESS = 'dooex/doodles/GET_DOODLES_SUCCESS';
const GET_DOODLES_FAILURE = 'dooex/doodles/GET_DOODLES_FAILURE';

const UPDATE_DOODLE = 'dooex/doodles/UPDATE_DOODLE';

let fullDataLoaded = false;

const initialState = [];

function inflate(allDoodles, metaState) {
  const { allCountries, allTags, schema, linkTypes, urlPrefixes, savedDoodleIds } = metaState;

  allDoodles.forEach((doodle, i) => {
    doodle = {};

    schema.forEach((key, j) => {
      doodle[key] = allDoodles[i][j];
    });

    linkTypes.filter(linkType => schema.includes(linkType))
      .forEach((linkType) => {
        const urlPrefixesIdx = doodle[linkType][0];

        doodle[linkType] = doodle[linkType].replace(urlPrefixesIdx, urlPrefixes[urlPrefixesIdx]);
      });

    doodle.countries = doodle.countries.map(cIdx => allCountries[cIdx]);
    doodle.tags = doodle.tags.map(tIdx => allTags[tIdx]);

    if (savedDoodleIds.includes(doodle.id)) {
      doodle.isSaved = true;
    } else {
      doodle.isSaved = false;
    }

    allDoodles[i] = doodle;
  });

  return allDoodles;
}

function reducer(state = initialState, action, metaState) {
  switch (action.type) {
    case GET_DOODLES_SUCCESS:
      return inflate(action.data, metaState);

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

async function getData(dispatch, isSlice = false) {
  const sliceSize = isSlice ? 10 : -1;
  const isFullDataLoadRequest = !isSlice;

  dispatch({ type: GET_DOODLES_REQUEST });

  let data;
  try {
    if (sliceSize === -1) {
      data = await fetchJson('./data/data.json');
    } else {
      data = await fetchJson(`./data/data-${sliceSize}.json`);
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

  if (isFullDataLoadRequest) {
    fullDataLoaded = true;
  }
}

function getDoodlesSlice() {
  return async (dispatch) => {
    if (fullDataLoaded) {
      return;
    }

    await getMeta(dispatch);
    await getData(dispatch, true);
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

function updateDoodle(doodle) {
  return {
    type: UPDATE_DOODLE,
    doodle,
  };
}

export {
  UPDATE_DOODLE,

  getDoodlesSlice,
  getAllDoodles,
  updateDoodle,
};

export default reducer;
