import { LOGIN, LOGOUT } from "../actions/constants";
import { capitalizeAll } from "../utils/utils";

export const authReducerDefaultState = {
  uid: "",
  atividade: "",
  nome: "",
  foto: "",
  email: "",
};

export default (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        uid: action.uid,
        atividade: action.displayName.split(" ")[0],
        nome: capitalizeAll(action.displayName, 1),
        foto: action.photoURL,
        email: action.email,
      };
    case LOGOUT:
      return authReducerDefaultState;
    default:
      return state;
  }
};
