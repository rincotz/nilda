import { authenticate, logout } from "../../actions/auth";
import { LOGIN, LOGOUT } from "../../constants";

test("should authenticate action object", () => {
  const action = authenticate({
    uid: 345,
    displayName: "Nilda",
    photoURL: "nourl.com",
    email: "nilda@nilda.com",
  });
  expect(action).toEqual({
    type: LOGIN,
    uid: 345,
    displayName: "Nilda",
    photoURL: "nourl.com",
    email: "nilda@nilda.com",
  });
});

test("should fire logout action object", () => {
  const action = logout();
  expect(action).toEqual({ type: LOGOUT });
});
