import doodles from 'modules/doodles/reducer';
import meta from 'modules/meta/reducer';
import filters from 'modules/filters/reducer';
import search from 'modules/search/reducer';
import date from 'modules/date/reducer';
import timeTravel from 'modules/time-travel/reducer';

function rootReducer(state = {}, action) {
  console.log(action.type);

  const metaState = meta(state.meta, action);
  const doodlesState = doodles(state.doodles, action, metaState);
  const filtersState = filters(state.filters, action);
  const searchState = search(state.search, action);
  const dateState = date(state.date, action);
  const timeTravelState = timeTravel(state.timeTravel, action);

  const nextState = {
    doodles: doodlesState,
    meta: metaState,
    filters: filtersState,
    search: searchState,
    date: dateState,
    timeTravel: timeTravelState,
  };

  return nextState;
}

export default rootReducer;
