import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import MockFirebase from "firebase-mock";
import * as constants from "../constants";
import * as actions from "../actions";
import initialState from "../store";

const createMockStore = configureMockStore([thunk]);
let store;

describe("actions", () => {
  beforeEach(() => {
    store = createMockStore(initialState);
  });
  it("should dispatch previousStep action object", () => {
    store.dispatch(actions.previousStep());
    expect(store.getActions()).toEqual([{ type: constants.PREVIOUS_STEP }]);
  });
  it("should dispatch nextStep action object", () => {
    store.dispatch(actions.nextStep());
    expect(store.getActions()).toEqual([{ type: constants.NEXT_STEP }]);
  });
  it("should set authenticated user", () => {
    store.dispatch(actions.setUser());
  });
});
