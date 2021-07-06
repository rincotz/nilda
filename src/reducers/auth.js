import { LOGIN, LOGOUT } from "../constants";

export default (state = null, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        uid: action.uid,
        atividade: action.displayName.split(" ")[0],
        nome: action.displayName,
        foto: action.photoURL,
        email: action.email,
      };
    case LOGOUT:
      return null;
    default:
      return state;
  }
};
