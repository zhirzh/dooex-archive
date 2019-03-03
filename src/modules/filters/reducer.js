import uuid from 'uuid';
import qs from 'qs';

const ADD_FILTER = 'dooex/filter/ADD_FILTER';
const REMOVE_FILTER = 'dooex/filter/REMOVE_FILTER';
const RESET_FILTER = 'dooex/filter/RESET_FILTER';

const initialState = parse();

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FILTER: {
      const filter = {
        ...action.filter,
        id: uuid(),
      };

      return [
        ...state,
        filter,
      ];
    }

    case REMOVE_FILTER: {
      const filterIdx = state.findIndex(filter =>
        (filter.type === action.filter.type) && (filter.value === action.filter.value));

      return [
        ...state.slice(0, filterIdx),
        ...state.slice(filterIdx + 1),
      ];
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

function stringify(filtersState) {
  const filterQuery = filtersState.reduce((_filterQuery, filter) => {
    const { type, value } = filter;

    _filterQuery[type] = _filterQuery[type] || [];
    _filterQuery[type].push(value.replace(/ /g, '+'));

    return _filterQuery;
  }, {});

  const locationQuery = qs.parse(window.location.search.slice(1));

  const query = {
    ...locationQuery,
    type: filterQuery.type,
    country: filterQuery.country,
  }

  const queryString = qs.stringify(query, { encode: false, arrayFormat: 'brackets' });

  return queryString;
}

function parse() {
  const query = qs.parse(window.location.search.slice(1));

  let filtersState = [];

  if (query.country) {
    filtersState = filtersState.concat(
      query.country.map(filterValue => ({
        id: uuid(),
        type: 'country',
        value: filterValue,
      }))
    );
  }

  if (query.type) {
    filtersState = filtersState.concat(
      query.type.map(filterValue => ({
        id: uuid(),
        type: 'type',
        value: filterValue,
      }))
    );
  }

  return filtersState;
}

export {
  addFilter,
  removeFilter,
  resetFilter,

  stringify,
};

export default reducer;
