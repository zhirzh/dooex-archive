import polyfill from 'browser-polyfill';

const GET_DOODLES_REQUEST = 'dooex/doodles/GET_DOODLES_REQUEST';
const GET_DOODLES_SUCCESS = 'dooex/doodles/GET_DOODLES_SUCCESS';
const GET_DOODLES_FAILURE = 'dooex/doodles/GET_DOODLES_FAILURE';

const UPDATE_SAVE = 'dooex/doodles/UPDATE_SAVE';

const initialState = {
  doodles: [],
  countries: [],
  tags: [],
  types: [],
};

function inflate({ doodlesData, meta }) {
  const { schema, countries, tags, types, urlPrefixes } = meta;
  const savedDoodles = JSON.parse(polyfill.localStorage.getItem('saved-doodles')) || [];

  const doodles = doodlesData.map((d) => {
    d = d.reduce((res, v, i) => {
      const k = schema[i];
      res[k] = v;

      return res;
    }, {});

    d.tags = d.tags.map(t => tags[t]);
    d.countries = d.countries.map(c => countries[c]);
    d.type = types[d.type];

    d.isSaved = savedDoodles.includes(d.id);

    const urlTypes = [
      'alternate_url',
      'call_to_action_image_url',
      'hires_url',
      'standalone_html',
      'url',
    ];

    urlTypes.forEach((urlType) => {
      const url = d[urlType];

      if (url) {
        const prefix = urlPrefixes[+url[0]];

        d[urlType] = `${prefix}${url.slice(1)}`;
      }
    });

    return d;
  });

  return {
    doodles,
    countries,
    tags,
    types,
  };
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_DOODLES_SUCCESS:
      return {
        ...state,
        ...inflate(action.payload),
      };

    case UPDATE_SAVE: {
      const {
        doodleId: id,
        isSaved,
      } = action.payload;

      const doodle = state.doodles.filter(d => (d.id === id))[0];
      const idx = state.doodles.indexOf(doodle);

      return {
        ...state,

        doodles: [
          ...state.doodles.slice(0, idx),
          {
            ...doodle,
            isSaved,
          },
          ...state.doodles.slice(idx + 1),
        ],
      };
    }

    default:
      return state;
  }
}

function getDoodles() {
  return (dispatch) => {
    dispatch({ type: GET_DOODLES_REQUEST });

    const fetchData = Promise.all([
      fetch('./data/doodles-data.json').then(resp => resp.json()),
      fetch('./data/doodles-meta.json').then(resp => resp.json()),
    ]);

    return fetchData
      .then(([doodlesData, meta]) => dispatch({
        type: GET_DOODLES_SUCCESS,
        payload: { doodlesData, meta },
      }))
      /* TODO: catch swalaloes errors */
      .catch(err => dispatch({
        type: GET_DOODLES_FAILURE,
        payload: err
      }));
  };
}

function updateSave(doodleId, isSaved) {
  return {
    type: UPDATE_SAVE,
    payload: {
      doodleId,
      isSaved,
    },
  };
}

export {
  getDoodles,
  updateSave,
};

export default reducer;
