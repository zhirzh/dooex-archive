// @flow

const UPDATE_KEYWORD = 'search/UPDATE_KEYWORD';
const RESET_KEYWORD = 'search/RESET_KEYWORD';

type State = string;

type Action = { type: 'search/UPDATE_KEYWORD', keyword: string } | { type: 'search/RESET_KEYWORD' };

const locationURL = new URL(window.location);
const initialState: State = locationURL.searchParams.get('search') || '';

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_KEYWORD:
      return action.keyword;

    case RESET_KEYWORD:
      return '';

    default:
      return state;
  }
}

function updateKeyword(keyword: string): Action {
  return {
    type: UPDATE_KEYWORD,
    keyword,
  };
}

function resetKeyword(): Action {
  return {
    type: RESET_KEYWORD,
  };
}

export { UPDATE_KEYWORD, RESET_KEYWORD, updateKeyword, resetKeyword };

export default reducer;
