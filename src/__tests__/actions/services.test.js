import {
  newServiceInstance,
  stageService,
  setServices,
  editService,
  deleteService,
  clearServices,
  cadastroDisponibilidade,
  cadastroDiarias,
  requisicaoCadastro,
  agendamento,
  diaristasDisponiveis,
  pesquisaDiarias,
  aceitarDiarista,
  aceitarServico,
} from "../../actions/services";
import {
  NEW_SERVICE_INSTANCE,
  STAGE_SERVICE,
  SET_SERVICES,
  EDIT_SERVICE,
  DELETE_SERVICE,
  CLEAR_SERVICES,
} from "../../actions/constants";
import { hirer, services, worker } from "../../utils/fixtures";
import { filterState, semanaArray } from "../../utils/utils";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  cadastroRef,
  diariaRef,
  disponibilidadeRef,
  servicoRef,
} from "../../utils/query";
import moment from "../__mocks__/moment";
import "moment/locale/pt-br";
import * as regrasNegocio from "../../utils/BusinessRules";

moment().locale("pt-br");

const createMockStore = configureMockStore([thunk]);

test("should initialize a new service instance", () => {
  const action = newServiceInstance();
  expect(action).toEqual({
    type: NEW_SERVICE_INSTANCE,
    service: newServiceInstance().service,
  });
});

test("should fire stageService action object", () => {
  const action = stageService(services[0]);
  expect(action).toEqual({
    type: STAGE_SERVICE,
    service: services[0],
  });
});

test("should fire setServices action object", () => {
  const action = setServices(services);
  expect(action).toEqual({
    type: SET_SERVICES,
    services,
  });
});

test("should fire editService action object", () => {
  const action = editService(services[0].sid, { dia: "sex" });
  expect(action).toEqual({
    type: EDIT_SERVICE,
    sid: services[0].sid,
    updates: { dia: "sex" },
  });
});

test("should fire deleteService action object", () => {
  const action = deleteService(services[0].sid);
  expect(action).toEqual({
    type: DELETE_SERVICE,
    sid: services[0].sid,
  });
});

test("should fire clearServices action object", () => {
  const action = clearServices();
  expect(action).toEqual({
    type: CLEAR_SERVICES,
  });
});

test("cadastroDisponibilidade", () => {
  const store = createMockStore({ worker });
  return store.dispatch(cadastroDisponibilidade()).then(() => {
    return Promise.all([
      disponibilidadeRef("seg", worker.uid).get(),
      disponibilidadeRef("ter", worker.uid).get(),
    ]).then((collection) => {
      expect(collection[0].data()).toEqual({
        disponibilidade: expect.any(Number),
        ...filterState(worker, [
          "atividade",
          "senha",
          "diasOcup",
          "diasLivres",
          "diasFolga",
          "verificador",
        ]),
        g: expect.any(Object),
      });
      expect(collection[1].data()).toEqual({
        disponibilidade: 4,
        ...filterState(worker, [
          "atividade",
          "senha",
          "diasOcup",
          "diasLivres",
          "diasFolga",
          "verificador",
        ]),
        g: expect.any(Object),
      });
    });
  });
});

test("cadastroDiarias", () => {
  const store = createMockStore({ user: hirer, services });
  return store.dispatch(cadastroDiarias()).then(() =>
    Promise.all([
      diariaRef(services[0].diaAgendado, services[0].sid).get(),
      diariaRef(services[1].diaAgendado, services[1].sid).get(),
    ]).then((collection) => {
      expect(collection[0].data()).toEqual({
        ...filterState(services[0], ["nomeDiarista", "telefoneDiarista"]),
        ...filterState(hirer, ["senha"]),
        vencimento: expect.any(Number),
        g: expect.any(Object),
      });
      expect(collection[1].data()).toEqual({
        ...filterState(services[1], ["nomeDiarista", "telefoneDiarista"]),
        ...filterState(hirer, ["senha"]),
        vencimento: expect.any(Number),
        g: expect.any(Object),
      });
    })
  );
});

describe("requisicaoCadastro", (done) => {
  const store = createMockStore({ user: hirer, services });
  test("should update firestore database", () => {
    return store.dispatch(requisicaoCadastro()).then(() => {
      return Promise.all([
        cadastroRef(services[0].sid).get(),
        cadastroRef(services[1].sid).get(),
      ]).then((collection) => {
        expect(collection[0].data()).toEqual({
          ...filterState(services[0]),
          ...filterState(hirer, ["senha", "atividade"]),
          vencimento: expect.any(Number),
        });
        expect(collection[1].data()).toEqual({
          ...filterState(services[1]),
          ...filterState(hirer, ["senha", "atividade"]),
          vencimento: expect.any(Number),
        });
      });
    });
  });
});

describe("agendamento", () => {
  test("should return right schedule date", () => {
    const diaAgendado = "ter";
    const proximaTerca = (number) =>
      moment()
        .startOf("day")
        .weekday(semanaArray.indexOf(diaAgendado) + 7)
        .add(number, "week")
        .valueOf();
    const agendamentosAnteriores = [proximaTerca(0), proximaTerca(1)];
    expect(agendamento(diaAgendado, agendamentosAnteriores)).toEqual(
      proximaTerca(2)
    );
  });
});

describe("diaristasDisponiveis", () => {
  const store = createMockStore({ user: hirer });
  test("should return available workers on given day if cnpj is verified", () => {
    return store.dispatch(diaristasDisponiveis("ter", 4)).then((diaristas) => {
      expect(diaristas).toEqual([
        {
          disponibilidade: expect.any(Number),
          distancia: expect.any(Number),
          ...filterState(worker, [
            "atividade",
            "senha",
            "diasOcup",
            "diasLivres",
            "diasFolga",
            "verificador",
          ]),
          g: expect.any(Object),
        },
      ]);
    });
  });
});

describe("diariasDisponiveis", () => {
  const store = createMockStore({ user: worker });
  test("should retrieve diarias from firestore", () => {
    return store
      .dispatch(pesquisaDiarias(services[1].diaAgendado))
      .then((diarias) => {
        expect(diarias).toEqual([
          {
            ...filterState(hirer, ["senha"]),
            ...filterState(services[1], ["nomeDiarista", "telefoneDiarista"]),
            distancia: expect.any(Number),
            vencimento: expect.any(Number),
            g: expect.any(Object),
          },
        ]);
      });
  });
});

describe("aceitarDiarista", () => {
  const store = createMockStore({ user: hirer, services });
  test("should vinculate a new worker to diaria and create service on firestore", () => {
    return store.dispatch(aceitarDiarista(worker, services[0].sid)).then(() =>
      servicoRef(services[0].sid)
        .get()
        .then((servicoRes) => {
          expect(servicoRes.data()).toEqual({
            uidDiarista: worker.uid,
            diarista: filterState(worker, [
              "atividade",
              "senha",
              "disponibilidade",
              "cnpjVerificado",
              "diasFolga",
              "diasLivres",
              "diasOcup",
            ]),
            ...filterState(hirer, ["atividade", "senha", "timestamp"]),
            ...filterState(services[0], [
              "timestamp",
              "nomeDiarista",
              "telefoneDiarista",
              "cadastrarDiarista",
            ]),
            timestamp: expect.any(String),
            status: regrasNegocio.EXECUCAO,
            renovacoes: 0,
            vencimento: expect.any(Number),
          });
        })
    );
  });
});

describe("aceitarServico", () => {
  const store = createMockStore({ user: worker });
  test("should vinculate a new worker to diaria and create service on firestore", () => {
    return store
      .dispatch(aceitarServico({ ...services[1], uid: hirer.uid }))
      .then(() =>
        servicoRef(services[1].sid)
          .get()
          .then((servicoRes) => {
            expect(servicoRes.data()).toEqual({
              uidDiarista: worker.uid,
              diarista: filterState(worker, [
                "atividade",
                "senha",
                "disponibilidade",
                "cnpjVerificado",
                "diasFolga",
                "diasLivres",
                "diasOcup",
              ]),
              ...filterState(hirer, ["atividade", "senha", "timestamp"]),
              ...filterState(services[1], [
                "timestamp",
                "nomeDiarista",
                "telefoneDiarista",
                "cadastrarDiarista",
              ]),
              timestamp: expect.any(String),
              status: regrasNegocio.EXECUCAO,
              renovacoes: 0,
              vencimento: expect.any(Number),
            });
          })
      );
  });
});
