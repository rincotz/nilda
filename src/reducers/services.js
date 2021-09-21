import {
  CLEAR_SERVICES,
  DELETE_SERVICE,
  EDIT_SERVICE,
  NEW_SERVICE_INSTANCE,
  SET_SERVICES,
  STAGE_SERVICE,
} from "../actions/constants";

const servicesReducerDefaultState = [];

export default (state = servicesReducerDefaultState, action) => {
  switch (action.type) {
    case NEW_SERVICE_INSTANCE:
      return [...state, action.service];
    case STAGE_SERVICE:
      return [...state, action.service];
    case EDIT_SERVICE:
      return state.map((service) => {
        if (service.sid === action.sid) {
          return { ...service, ...action.updates };
        } else return service;
      });
    case DELETE_SERVICE:
      return state.filter((service) => service.sid !== action.sid);
    case SET_SERVICES:
      return action.services;
    case CLEAR_SERVICES:
      return servicesReducerDefaultState;
    default:
      return state;
  }
};
