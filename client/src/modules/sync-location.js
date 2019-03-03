import history from 'modules/history';
import { UPDATE_KEYWORD, RESET_KEYWORD } from 'reducers/search';

const syncLocation = store => next => (action) => {
  const result = next(action);

  switch (action.type) {
    case UPDATE_KEYWORD: {
      const locationURL = new URL(window.location);
      locationURL.searchParams.set('search', action.keyword);

      history.push(`${locationURL.pathname}${locationURL.search}`);

      break;
    }

    case RESET_KEYWORD: {
      const locationURL = new URL(window.location);
      locationURL.searchParams.delete('search');

      history.push(`${locationURL.pathname}${locationURL.search}`);

      break;
    }

    default:
  }

  return result;
};

export default syncLocation;
