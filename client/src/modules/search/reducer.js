const SET_SEARCH = 'dooex/search/SET_SEARCH';
const RESET_SEARCH = 'dooex/search/RESET_SEARCH';

const initialState = '';

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH:
      return action.keyword;

    case RESET_SEARCH:
      return '';

    default:
      return state;
  }
}

function setSearch(keyword) {
  return {
    type: SET_SEARCH,
    keyword,
  };
}

function resetSearch() {
  return {
    type: RESET_SEARCH,
  };
}

export { SET_SEARCH, RESET_SEARCH, setSearch, resetSearch };

export default reducer;
