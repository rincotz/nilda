import authReducer from "../../reducers/auth";
import { LOGIN, LOGOUT } from "../../constants";

test("should set default state", () => {
  const state = authReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual(null);
});

test("should set auth credentials", () => {
  const action = {
    type: LOGIN,
    uid: "asfijoaspy92",
    displayName: "diarista nilda maria",
    photoURL: "someURL",
    email: "nilda@nilda.com.br",
  };
  const state = authReducer(null, action);
  expect(state).toEqual({
    uid: "asfijoaspy92",
    atividade: "diarista",
    nome: "diarista nilda maria",
    foto: "someURL",
    email: "nilda@nilda.com.br",
  });
});

test("should clear auth credentials", () => {
  const action = { type: LOGOUT };
  const state = authReducer(
    {
      uid: "asfijoaspy92",
      atividade: "diarista",
      nome: "diarista nilda maria",
      foto: "someURL",
      email: "nilda@nilda.com.br",
    },
    action
  );
  expect(state).toEqual(null);
});
