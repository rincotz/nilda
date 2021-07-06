import * as firebase from "firebase";
import { auth } from "../firebase";
import { LOGIN, LOGOUT } from "../constants";

export const authenticate = ({ uid, displayName, photoURL, email }) => ({
  type: LOGIN,
  uid,
  displayName,
  photoURL,
  email,
});

export const logout = () => ({ type: LOGOUT });

export const startAuthenticate = () => (dispatch) =>
  auth.onAuthStateChanged((user) =>
    user
      ? dispatch(
          authenticate({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          })
        )
      : dispatch(logout())
  );

export const login = (email, password) => (dispatch) =>
  auth
    .signInWithEmailAndPassword(email, password)
    .then((authToken) => dispatch(authenticate(authToken.user)))
    .catch((error) => error);
