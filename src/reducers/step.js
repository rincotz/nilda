import { PREVIOUS, NEXT, CLEAR_STEP, SET_STEP } from "../actions/constants";

const stepReducerDefaultState = 0;

export default (state = stepReducerDefaultState, action) => {
  switch (action.type) {
    case PREVIOUS:
      return state - 1;
    case NEXT:
      return state + 1;
    case CLEAR_STEP:
      return 0;
    case SET_STEP:
      return action.step;
    default:
      return state;
  }
};
