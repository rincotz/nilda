import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import * as constants from "./constants";
import { setUser } from "./actions";

export const initialState = {
  user: {
    uid: "",
    atividade: "",
    email: "",
  },
  step: 0,
  error: "",
  loadingUID: true,
};

export const userSubscription = (state = initialState, action) => {
  switch (action.type) {
    case constants.LOGIN_FAIL:
      return { ...state, error: action.error };
    case constants.NEXT_STEP:
      return { ...state, step: state.step + 1 };
    case constants.PREVIOUS_STEP:
      return { ...state, step: state.step - 1 };
    case constants.SET_USER:
      return action.user.email
        ? {
            ...state,
            user: {
              ...state.user,
              uid: action.user.uid,
              atividade: action.user.displayName.split(" ")[0],
              displayName: action.user.displayName,
              photoURL: action.user.photoURL,
              email: action.user.email,
            },
          }
        : { ...state };
    case constants.CLEAN_USER:
      return { ...state, user: initialState.user };
    case constants.STAGE_USER:
      return { ...state, user: { ...state.user, ...action.user } };
    case constants.STAGE_SERVICE:
      return { ...state, service: { ...state.service, ...action.service } };
    default:
      return state;
  }
};

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = createStore(userSubscription, enhancer);

store.dispatch(setUser());

export default store;
