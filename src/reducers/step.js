import { PREVIOUS, NEXT, CLEAR } from "../constants";

export default (state = { step: 0 }, action) => {
  switch (action.type) {
    case PREVIOUS:
      return { step: state.step - 1 };
    case NEXT:
      return { step: state.step + 1 };
    case CLEAR:
      return { step: 0 };
    default:
      return state;
  }
};
