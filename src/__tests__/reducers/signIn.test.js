import signInReducer from "../../reducers/signIn";
import {
  CLEAR_USER,
  NEW_HIRER_INSTANCE,
  STAGE_USER,
} from "../../actions/constants";
import { hirer, worker } from "../../utils/fixtures";
import { newHirerInstance, newWorkerInstance } from "../../actions/signIn";

test("should set default state", () => {
  const state = signInReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual({});
});

test("should set a new hirer instance to state", () => {
  const action = newHirerInstance(hirer);
  const state = signInReducer(null, action);
  expect(state).toEqual(newHirerInstance(hirer).user);
});

test("should set a new worker instance to state", () => {
  const action = newWorkerInstance(worker);
  const state = signInReducer(null, action);
  expect(state).toEqual(newWorkerInstance(worker).user);
});

test("should add user info to state", () => {
  const action = {
    type: STAGE_USER,
    user: worker,
  };
  const state = signInReducer(newWorkerInstance(worker).user, action);
  expect(state).toEqual(worker);
});

test("should set state to empty object", () => {
  const action = { type: CLEAR_USER };
  const state = signInReducer(worker, action);
  expect(state).toEqual({});
});
