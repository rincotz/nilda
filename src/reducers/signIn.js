import { CLEAR_USER, STAGE_USER } from "../constants";

const signInReducerDefaultState = {};

export default (state = signInReducerDefaultState, action) => {
  switch (action.type) {
    case STAGE_USER:
      return { ...state.user, ...action.user };
    case CLEAR_USER:
      return {};
    default:
      return state;
  }
};
