import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import auth from "./reducers/auth";
import services from "./reducers/services";
import signIn from "./reducers/signIn";
import step from "./reducers/step";
import { setLoggedUserData, startAuthenticate } from "./actions/auth";

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const configureStore = (initialState) =>
  createStore(
    combineReducers({
      auth: auth,
      services: services,
      user: signIn,
      step: step,
    }),
    initialState,
    enhancer
  );

const store = configureStore();

store.dispatch(startAuthenticate());

export default store;
