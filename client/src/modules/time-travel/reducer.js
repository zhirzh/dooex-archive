const RESET_DISTANCE = 'dooex/search/RESET_DISTANCE';
const UPDATE_DISTANCE = 'dooex/search/UPDATE_DISTANCE';

const initialState = -1;

function reducer(state = initialState, action) {
  switch (action.type) {
    case RESET_DISTANCE:
      return -1;

    case UPDATE_DISTANCE:
      return action.distance;

    default:
      return state;
  }
}

function resetDistance() {
  return {
    type: UPDATE_DISTANCE,
  };
}

function updateDistance(distance) {
  return {
    type: UPDATE_DISTANCE,
    distance,
  };
}

export { resetDistance, updateDistance };

export default reducer;
