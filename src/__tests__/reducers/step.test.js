import stepReducer from "../../reducers/step";
import { PREVIOUS, NEXT, CLEAR_STEP } from "../../actions/constants";

test("should set default state", () => {
  const state = stepReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual(0);
});

test("should set step back", () => {
  const action = { type: PREVIOUS };
  const state = stepReducer(6, action);
  expect(state).toEqual(5);
});

test("should set step forward", () => {
  const action = { type: NEXT };
  const state = stepReducer(6, action);
  expect(state).toEqual(7);
});

test("should set step back to 0", () => {
  const action = { type: CLEAR_STEP };
  const state = stepReducer(6, action);
  expect(state).toEqual(0);
});
