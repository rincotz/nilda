import {
  stageService,
  setServices,
  editService,
  deleteService,
  clearServices,
} from "../../actions/services";
import {
  STAGE_SERVICE,
  SET_SERVICES,
  EDIT_SERVICE,
  DELETE_SERVICE,
  CLEAR_SERVICES,
} from "../../constants";
import { services } from "../../utils/fixtures";

test("should fire stageService action object", () => {
  const action = stageService(services[0]);
  expect(action).toEqual({
    type: STAGE_SERVICE,
    service: services[0],
  });
});

test("should fire setServices action object", () => {
  const action = setServices(services);
  expect(action).toEqual({
    type: SET_SERVICES,
    services,
  });
});

test("should fire editService action object", () => {
  const action = editService(services[0].sid, { dia: "sex" });
  expect(action).toEqual({
    type: EDIT_SERVICE,
    sid: services[0].sid,
    updates: { dia: "sex" },
  });
});

test("should fire deleteService action object", () => {
  const action = deleteService(services[0].sid);
  expect(action).toEqual({
    type: DELETE_SERVICE,
    sid: services[0].sid,
  });
});

test("should fire clearServices action object", () => {
  const action = clearServices();
  expect(action).toEqual({
    type: CLEAR_SERVICES,
  });
});
