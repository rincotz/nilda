import { auth, database } from "../firebase";
import { LOGIN, LOGOUT } from "./constants";
import { clearUser, stageUser } from "./signIn";
import { clearServices, newServiceInstance } from "./services";
import { clearStep } from "./step";

export const authenticate = ({ uid, displayName, photoURL, email }) => ({
  type: LOGIN,
  uid,
  displayName,
  photoURL,
  email,
});

// Testar aceitar diarista e implementar block de botoes e reload como aceitarServico

export const logout = () => ({ type: LOGOUT });

export const setLoggedUserData = () => {
  return (dispatch, getState) => {
    return database
      .collection(getState().auth.atividade)
      .doc(getState().auth.uid)
      .get()
      .then((user) => {
        dispatch(stageUser(user.data()));
      });
  };
};

export const startAuthenticate = () => (dispatch, getState) =>
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(authenticate(user));
      getState().auth.atividade === "contratante" &&
        getState().services.length === 0 &&
        dispatch(newServiceInstance());
      return dispatch(setLoggedUserData());
    } else {
      dispatch(logout());
    }
  });

export const login = (email, password) => (dispatch) =>
  auth
    .signInWithEmailAndPassword(email, password)
    .then((authToken) => dispatch(authenticate(authToken.user)))
    .catch((error) => error);

export const startLogout = () => (dispatch) =>
  auth
    .signOut()
    .then((success) => {
      dispatch(logout());
      dispatch(clearStep());
      dispatch(clearUser());
      dispatch(clearServices());
      return success;
    })
    .catch((error) => error);
