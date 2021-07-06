import {
  CLEAR_SERVICES,
  DELETE_SERVICE,
  EDIT_SERVICE,
  SET_SERVICES,
  STAGE_SERVICE,
} from "../constants";

const signInReducerDefaultState = [];

export default (state = signInReducerDefaultState, action) => {
  switch (action.type) {
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
      return [];
    default:
      return state;
  }
};
