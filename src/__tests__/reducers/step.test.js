import stepReducer from "../../reducers/step";
import { PREVIOUS, NEXT, CLEAR } from "../../constants";

test("should set default state", () => {
  const state = stepReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual({ step: 0 });
});

test("should set step back", () => {
  const action = { type: PREVIOUS };
  const state = stepReducer({ step: 6 }, action);
  expect(state).toEqual({ step: 5 });
});

test("should set step forward", () => {
  const action = { type: NEXT };
  const state = stepReducer({ step: 6 }, action);
  expect(state).toEqual({ step: 7 });
});

test("should set step back to 0", () => {
  const action = { type: CLEAR };
  const state = stepReducer({ step: 6 }, action);
  expect(state).toEqual({ step: 0 });
});
