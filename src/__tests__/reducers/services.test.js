import servicesReducer from "../../reducers/services";
import { services } from "../../utils/fixtures";
import {
  NEW_SERVICE_INSTANCE,
  DELETE_SERVICE,
  SET_SERVICES,
  CLEAR_SERVICES,
  EDIT_SERVICE,
  STAGE_SERVICE,
} from "../../actions/constants";
import { newServiceInstance } from "../../actions/services";

test("should set default state", () => {
  const state = servicesReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual([]);
});

test("should add new service instance object to state array", () => {
  const action = {
    type: NEW_SERVICE_INSTANCE,
    service: newServiceInstance().service,
  };
  const state = servicesReducer([newServiceInstance().service], action);
  expect(state).toEqual([
    newServiceInstance().service,
    newServiceInstance().service,
  ]);
});

test("should remove service by sid", () => {
  const action = {
    type: DELETE_SERVICE,
    sid: services[0].sid,
  };
  const state = servicesReducer(services, action);
  expect(state).toEqual([services[1]]);
});

test("should not remove service if sid not found", () => {
  const action = {
    type: DELETE_SERVICE,
    sid: "87139623",
  };
  const state = servicesReducer(services, action);
  expect(state).toEqual(services);
});

test("should add service", () => {
  const action = {
    type: STAGE_SERVICE,
    service: services[0],
  };
  const state = servicesReducer(services, action);
  expect(state).toEqual([...services, services[0]]);
});

test("should edit service from state", () => {
  const action = {
    type: EDIT_SERVICE,
    sid: services[0].sid,
    updates: { dia: "sab" },
  };
  const state = servicesReducer(services, action);
  expect(state).toEqual([{ ...services[0], dia: "sab" }, services[1]]);
});

test("should not edit service if sid not found", () => {
  const action = {
    type: EDIT_SERVICE,
    sid: "73492364892323",
    updates: { dia: "sab" },
  };
  const state = servicesReducer(services, action);
  expect(state).toEqual(services);
});

test("should set services to state", () => {
  const action = {
    type: SET_SERVICES,
    services,
  };
  const state = servicesReducer(services[1], action);
  expect(state).toEqual(services);
});

test("should set state to empty array", () => {
  const action = { type: CLEAR_SERVICES };
  const state = servicesReducer(services, action);
  expect(state).toEqual([]);
});
