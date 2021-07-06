import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import auth from "./reducers/auth";
import services from "./reducers/services";
import signIn from "./reducers/signIn";
import step from "./reducers/step";
import { setUser } from "./actions/users";

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = () =>
  createStore(
    combineReducers({ auth, services, signIn, step }),
    composeEnhancers(applyMiddleware(thunk))
  );

store.dispatch(setUser());

export default store;
