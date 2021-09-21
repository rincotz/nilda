import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  addHirer,
  newHirerInstance,
  newWorkerInstance,
  stageFirebaseUser,
  stageUser,
  startStageUser,
} from "../../actions/signIn";
import {
  NEW_HIRER_INSTANCE,
  NEW_WORKER_INSTANCE,
  STAGE_USER,
} from "../../actions/constants";
import { hirer, worker } from "../../utils/fixtures";
import { filterState } from "../../utils/utils";
import { contratanteRef, diaristaRef } from "../../utils/query";

const createMockStore = configureMockStore([thunk]);

test("should fire newHirerInstance object", () => {
  const action = newHirerInstance(hirer);
  expect(action).toEqual({
    type: NEW_HIRER_INSTANCE,
    user: newHirerInstance(hirer).user,
  });
});

beforeEach(() => {});

test("should fire newWorkerInstance object", () => {
  const action = newWorkerInstance(worker);
  expect(action).toEqual({
    type: NEW_WORKER_INSTANCE,
    user: newWorkerInstance(worker).user,
  });
});

test("should fire stageUser action object", () => {
  const action = stageUser(hirer);
  expect(action).toEqual({
    type: STAGE_USER,
    user: hirer,
  });
});

describe("startStageUser", () => {
  const store = createMockStore({ auth: { uid: worker.uid } });
  const action = store.getActions();
  test("should update firestore database", () => {
    return store
      .dispatch(startStageUser(worker, ["senha", "verificador"]))
      .then(() => {
        return diaristaRef(worker.uid)
          .get()
          .then((snapshot) => {
            expect(snapshot.data()).toEqual({
              ...filterState({ ...worker, isComplete: false }, [
                "senha",
                "verificador",
              ]),
              disponibilidade: expect.any(Number),
            });
            expect(action[0].type).toBe(STAGE_USER);
          });
      });
  });
});

describe("addHirer", () => {
  test("should add hirer to database", () =>
    stageFirebaseUser(hirer, true, ["senha"]).then(() =>
      contratanteRef(hirer.uid)
        .get()
        .then((contratante) => {
          expect(contratante.data()).toEqual({
            ...filterState(hirer, ["senha"]),
            isComplete: true,
          });
        })
    ));
});

describe("addWorker", () => {
  test("should add worker to database", () =>
    stageFirebaseUser(worker, true, ["senha", "verificador"]).then(() =>
      diaristaRef(worker.uid)
        .get()
        .then((contratante) => {
          expect(contratante.data()).toEqual({
            ...filterState(worker, ["senha", "verificador"]),
            isComplete: true,
            disponibilidade: expect.any(Number),
          });
        })
    ));
});
