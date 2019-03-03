import doodles from 'reducers/doodles';
import infiniteScroll from 'reducers/infinite-scroll';
import meta from 'reducers/meta';
import search from 'reducers/search';

const initialState = {};

function rootReducer(state = initialState, action) {
  const metaState = meta(state.meta, action);
  const doodlesState = doodles(state.doodles, action, metaState);

  const searchState = search(state.search, action);

  const infiniteScrollState = infiniteScroll(state.infiniteScrollBatchSize, action);

  const nextState = {
    doodles: doodlesState,
    meta: metaState,
    search: searchState,
    infiniteScrollBatchSize: infiniteScrollState,
  };

  return nextState;
}

export default rootReducer;
