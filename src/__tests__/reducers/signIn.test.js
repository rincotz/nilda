import signInReducer from "../../reducers/signIn";
import { CLEAR_USER, STAGE_USER } from "../../constants";
import { worker } from "../../utils/fixtures";

test("should set default state", () => {
  const state = signInReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual({});
});

test("should add user info to state", () => {
  const action = {
    type: STAGE_USER,
    user: worker,
  };
  const state = signInReducer({}, action);
  expect(state).toEqual(worker);
});

test("should set state to empty object", () => {
  const action = { type: CLEAR_USER };
  const state = signInReducer(worker, action);
  expect(state).toEqual({});
});
