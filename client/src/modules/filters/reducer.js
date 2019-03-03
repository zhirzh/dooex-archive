const ADD_FILTER = 'dooex/filter/ADD_FILTER';
const REMOVE_FILTER = 'dooex/filter/REMOVE_FILTER';
const RESET_FILTER = 'dooex/filter/RESET_FILTER';

const initialState = [];

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FILTER: {
      return [...state, action.filter];
    }

    case REMOVE_FILTER: {
      const filterIdx = state.findIndex(
        filter => filter.type === action.filter.type && filter.value === action.filter.value,
      );

      return [...state.slice(0, filterIdx), ...state.slice(filterIdx + 1)];
    }

    case RESET_FILTER:
      return [];

    default:
      return state;
  }
}

function addFilter(filter) {
  return {
    type: ADD_FILTER,
    filter,
  };
}

function removeFilter(filter) {
  return {
    type: REMOVE_FILTER,
    filter,
  };
}

function resetFilter() {
  return {
    type: RESET_FILTER,
  };
}

export { ADD_FILTER, REMOVE_FILTER, RESET_FILTER, addFilter, removeFilter, resetFilter };

export default reducer;
