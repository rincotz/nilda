import {
  CLEAR_USER,
  NEW_HIRER_INSTANCE,
  NEW_WORKER_INSTANCE,
  STAGE_USER,
} from "../actions/constants";

const signInReducerDefaultState = {};

export default (state = signInReducerDefaultState, action) => {
  switch (action.type) {
    case NEW_HIRER_INSTANCE:
      return action.user;
    case NEW_WORKER_INSTANCE:
      return action.user;
    case STAGE_USER:
      return { ...state, ...action.user };
    case CLEAR_USER:
      return signInReducerDefaultState;
    default:
      return state;
  }
};
