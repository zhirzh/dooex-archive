const UPDATE_FROM = 'dooex/filter/UPDATE_FROM';
const UPDATE_TO = 'dooex/filter/UPDATE_TO';

const today = new Date();

const initialState = {
  min: {
    day: 30,
    month: 8,
    year: 1998,
  },

  max: {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  },

  from: {
    day: 30,
    month: 8,
    year: 1998,
  },

  to: {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FROM:
      return {
        ...state,
        from: {
          ...state.from,
          ...action.date,
        },
      };

    case UPDATE_TO:
      return {
        ...state,
        to: {
          ...state.to,
          ...action.date,
        },
      };

    default:
      return state;
  }
}

function updateFrom(date) {
  return {
    type: UPDATE_FROM,
    date,
  };
}

function updateTo(date) {
  return {
    type: UPDATE_TO,
    date,
  };
}

export { updateFrom, updateTo };

export default reducer;
