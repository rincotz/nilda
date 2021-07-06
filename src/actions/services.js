import {
  STAGE_SERVICE,
  SET_SERVICES,
  EDIT_SERVICE,
  DELETE_SERVICE,
  CLEAR_SERVICES,
} from "../constants";

export const stageService = (service) => ({
  type: STAGE_SERVICE,
  service,
});

export const setServices = (services) => ({
  type: SET_SERVICES,
  services,
});

export const editService = (sid, updates) => ({
  type: EDIT_SERVICE,
  sid,
  updates,
});

export const deleteService = (sid) => ({
  type: DELETE_SERVICE,
  sid,
});

export const clearServices = () => ({ type: CLEAR_SERVICES });
