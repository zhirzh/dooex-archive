import doodles from 'modules/doodles/reducer';
import filters from 'modules/filters/reducer';
import meta from 'modules/meta/reducer';

function rootReducer(state = {}, action) {
  const metaState = meta(state.meta, action);

  const doodlesState = doodles(state.doodles, action, metaState);
  const filtersState = filters(state.filters, action);

  const nextState = {
    doodles: doodlesState,
    filters: filtersState,
    meta: metaState,
  };

  return nextState;
}

export default rootReducer;
