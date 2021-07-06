import { previousStep, nextStep, clearStep } from "../../actions/step";
import { PREVIOUS, NEXT, CLEAR } from "../../constants";

test("should fire previousStep action object", () => {
  const action = previousStep();
  expect(action).toEqual({ type: PREVIOUS });
});

test("should fire nextStep action object", () => {
  const action = nextStep();
  expect(action).toEqual({ type: NEXT });
});

test("should fire clearStep action object", () => {
  const action = clearStep();
  expect(action).toEqual({ type: CLEAR });
});
