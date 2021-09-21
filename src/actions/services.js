import {
  CLEAR_SERVICES,
  DELETE_SERVICE,
  EDIT_SERVICE,
  NEW_SERVICE_INSTANCE,
  SET_SERVICES,
  STAGE_SERVICE,
} from "./constants";
import { database, fieldValueIncrement } from "../firebase";
import { filterState, normalizeData, semanaArray } from "../utils/utils";
import moment from "moment";
import {
  cadastroRef,
  contratanteRef,
  diariaGeoRef,
  diariaRef,
  diaristaRef,
  disponibilidadeGeoRef,
  disponibilidadeRef,
  getSid,
  servicoRef,
} from "../utils/query";
import "moment/locale/pt-br";
import * as regrasNegocio from "../utils/BusinessRules";
import { setLoggedUserData } from "./auth";
import { stageUser } from "./signIn";

moment().locale("pt-br");

export const newServiceInstance = () => ({
  type: NEW_SERVICE_INSTANCE,
  service: {
    sid: getSid(),
    horaAgendada: "",
    minAgendado: "",
    diaAgendado: "",
    numeroDiariasEm4Semanas: "",
    nomeDiarista: "",
    telefoneDiarista: "",
    faxinar: false,
    lavarRoupas: false,
    passarRoupas: false,
    timestamp: moment().format(),
  },
});

export const stageService = (service) => ({
  type: STAGE_SERVICE,
  service,
});

export const setServices = (services) => ({
  type: SET_SERVICES,
  services,
});

export const editService = (sid, updates) => ({
  type: EDIT_SERVICE,
  sid,
  updates,
});

export const deleteService = (sid) => ({
  type: DELETE_SERVICE,
  sid,
});

export const clearServices = () => ({ type: CLEAR_SERVICES });

export const cadastroDisponibilidade = (worker) => {
  return (dispatch) => {
    const promiseArray = [];
    const setDisponibilidade = () => {
      for (const [key, value] of Object.entries(worker.diasLivres)) {
        value &&
          promiseArray.push(
            disponibilidadeGeoRef(key, worker.uid).set({
              ...filterState(worker, ["diasLivres"]),
              disponibilidade: 4,
            })
          );
      }
      return Promise.all(promiseArray);
    };
    return worker.uid
      ? setDisponibilidade()
      : dispatch(setLoggedUserData()).then(() => setDisponibilidade());
  };
};

//TODO retirar pagamento antes de implementar
export const cadastroDiarias = () => {
  return (dispatch, getState) => {
    const hirer = getState().user;
    const servicos = [];
    const setDiarias = () => {
      getState().services.forEach((service) =>
        servicos.push(
          diariaGeoRef(service.diaAgendado, service.sid).set({
            ...filterState(hirer, ["senha"]),
            ...filterState(service, ["nomeDiarista", "telefoneDiarista"]),
            vencimento: moment()
              .endOf("day")
              .add(regrasNegocio.prazoAgendamento, "days")
              .valueOf(),
            pagamento: moment().format(),
          })
        )
      );
      return Promise.all(servicos);
    };
    return hirer.uid
      ? setDiarias()
      : dispatch(setLoggedUserData()).then(() => setDiarias());
  };
};

//TODO retirar pagamento antes de implementar
export const requisicaoCadastro = () => {
  return (dispatch, getState) => {
    const hirer = getState().user;
    const { services } = getState();
    const servicos = [];
    const setCadastros = () => {
      services.forEach((service) =>
        servicos.push(
          cadastroRef(service.sid).set({
            ...filterState(hirer, ["senha", "atividade"]),
            ...service,
            nomeDiarista: normalizeData(service.nomeDiarista),
            telefoneDiarista: `+55${normalizeData(service.telefoneDiarista)}`,
            vencimento: moment()
              .endOf("day")
              .add(regrasNegocio.prazoAgendamento, "days")
              .valueOf(),
            pagamento: moment().format(),
          })
        )
      );
      return Promise.all(servicos);
    };
    return hirer.uid
      ? setCadastros()
      : dispatch(setLoggedUserData()).then(() => setCadastros());
  };
};

export const agendamento = (diaAgendado, agendamentosAnteriores = []) => {
  let proximoDia = moment()
    .startOf("day")
    .weekday(semanaArray.indexOf(diaAgendado) + 7);
  const intervalo =
    proximoDia.diff(moment(), "days") < regrasNegocio.prazoNotificacao;
  proximoDia.isSameOrAfter(moment()) && intervalo && proximoDia.add(7, "days");
  while (agendamentosAnteriores.indexOf(proximoDia.valueOf()) !== -1) {
    proximoDia.add(7, "days");
  }
  return proximoDia.valueOf();
};

export const diaristasDisponiveis = (dia, numeroDiariasEm4Semanas) => {
  return (dispatch, getState) => {
    const diaristasDisponiveis = [];
    const user = getState().user;
    const query = () => {
      return disponibilidadeGeoRef(dia)
        .near({ center: user.coordinates, radius: regrasNegocio.raioBusca })
        .get()
        .then((diaristas) => {
          diaristas.docs.forEach((doc) => {
            const diarista = doc.data();
            if (
              diarista.cnpjVerificado &&
              diarista.disponibilidade >= numeroDiariasEm4Semanas
            ) {
              diaristasDisponiveis.push({
                ...diarista,
                distancia: doc.distance,
              });
            }
          });
          return diaristasDisponiveis;
        });
    };
    return user.uid
      ? query()
      : dispatch(setLoggedUserData()).then(() => query());
  };
};

export const pesquisaDiarias = (dia) => {
  return (dispatch, getState) => {
    const diariasDisponiveis = [];
    const user = getState().user;
    const query = () =>
      diariaGeoRef(dia)
        .near({ center: user.coordinates, radius: regrasNegocio.raioBusca })
        .get()
        .then((diarias) => {
          diarias.forEach((doc) => {
            const diaria = { ...doc.data(), distance: doc.distance };
            if (
              diaria.pagamento &&
              diaria.numeroDiariasEm4Semanas <= user.diasLivres[dia]
            ) {
              diariasDisponiveis.push(diaria);
            }
          });
          return diariasDisponiveis;
        });
    return user ? query() : dispatch(setLoggedUserData()).then(() => query());
  };
};

const novoServico = (servico, agendamento, contratante, diarista) => ({
  uidDiarista: diarista.uid,
  diarista: filterState(diarista, [
    "atividade",
    "agendamentos",
    "diasConversao",
    "senha",
    "disponibilidade",
    "cnpjVerificado",
    "diasFolga",
    "diasLivres",
    "diasOcup",
    "isComplete",
  ]),
  ...filterState(contratante, [
    "atividade",
    "senha",
    "timestamp",
    "isComplete",
    "cadastrarDiarista",
  ]),
  ...filterState(servico, [
    "atividade",
    "isComplete",
    "nomeDiarista",
    "telefoneDiarista",
    "cadastrarDiarista",
    "timestamp",
  ]),
  timestamp: moment().format(),
  status: regrasNegocio.EXECUCAO,
  renovacoes: 0,
  agendamento,
  vencimento: moment(agendamento)
    .add(regrasNegocio.prazoConfirmacao, "days")
    .endOf("day")
    .valueOf(),
});

// TODO acrescentar distancia ao serviço e ao analytics
export const aceitarDiarista = (diarista, sid) => {
  return (dispatch, getState) => {
    const contratante = getState().user;
    const servico = getState().services.find((service) => service.sid === sid);
    const setTransaction = () =>
      database.runTransaction((transaction) =>
        transaction
          .get(disponibilidadeRef(servico.diaAgendado, diarista.uid))
          .then((dispRes) => {
            const diaDarista = dispRes.data();
            const novaDiaria = agendamento(
              servico.diaAgendado,
              diaDarista.agendamentos
            );
            transaction.update(diaristaRef(diarista.uid), {
              [`diasLivres.${servico.diaAgendado}`]: fieldValueIncrement(
                -servico.numeroDiariasEm4Semanas
              ),
              disponibilidade: fieldValueIncrement(
                -servico.numeroDiariasEm4Semanas
              ),
            });
            transaction.update(
              disponibilidadeRef(servico.diaAgendado, diarista.uid),
              {
                agendamentos: diaDarista.agendamentos
                  ? diaDarista.agendamentos.push(novaDiaria)
                  : [novaDiaria],
                disponibilidade: fieldValueIncrement(
                  -servico.numeroDiariasEm4Semanas
                ),
              }
            );
            transaction.set(
              servicoRef(servico.sid),
              novoServico(servico, novaDiaria, contratante, diarista)
            );
            transaction.delete(diariaRef(servico.diaAgendado, servico.sid));
          })
      );
    return contratante.uid
      ? setTransaction()
      : setLoggedUserData().then(() => setTransaction());
  };
};

export const aceitarServico = (servico) => {
  return (dispatch, getState) => {
    const worker = getState().user;
    const setTransaction = () =>
      database
        .runTransaction((transaction) =>
          transaction
            .get(disponibilidadeRef(servico.diaAgendado, worker.uid))
            .then((disponibilidadeRes) => {
              return transaction
                .get(contratanteRef(servico.uid))
                .then((contratanteRes) => {
                  return transaction
                    .get(diaristaRef(worker.uid))
                    .then((diaristaRes) => {
                      const diaDisponivel = disponibilidadeRes.data();
                      const diarista = diaristaRes.data();
                      if (
                        diaDisponivel.disponibilidade >=
                        servico.numeroDiariasEm4Semanas
                      ) {
                        transaction.update(
                          disponibilidadeRef(servico.diaAgendado, worker.uid),
                          {
                            disponibilidade: fieldValueIncrement(
                              -servico.numeroDiariasEm4Semanas
                            ),
                            agendamentos: [
                              ...diaDisponivel.agendamentos,
                              agendamento(
                                servico.diaAgendado,
                                diaDisponivel.agendamentos
                              ),
                            ],
                          }
                        );
                        transaction.update(diaristaRef(worker.uid), {
                          [`diasLivres.${servico.diaAgendado}`]: fieldValueIncrement(
                            -servico.numeroDiariasEm4Semanas
                          ),
                          disponibilidade: fieldValueIncrement(
                            -servico.numeroDiariasEm4Semanas
                          ),
                          agendamentos: [
                            ...diarista.agendamentos,
                            agendamento(
                              servico.diaAgendado,
                              diaDisponivel.agendamentos
                            ),
                          ],
                        });
                        transaction.set(
                          servicoRef(servico.sid),
                          novoServico(
                            servico,
                            agendamento(
                              servico.diaAgendado,
                              diaDisponivel.agendamentos
                                ? diaDisponivel.agendamentos
                                : []
                            ),
                            contratanteRes.data(),
                            worker
                          )
                        );
                        transaction.delete(
                          diariaRef(servico.diaAgendado, servico.sid)
                        );
                      }
                    });
                });
            })
        )
        .then(
          dispatch(
            stageUser({
              diasLivres: {
                ...worker.diasLivres,
                [servico.diaAgendado]:
                  worker.diasLivres[servico.diaAgendado] -
                  servico.numeroDiariasEm4Semanas,
              },
            })
          )
        );
    return worker.uid
      ? setTransaction()
      : dispatch(setLoggedUserData()).then(() => setTransaction());
  };
};

export const pesquisaServicos = () => (dispatch, getState) => {
  const queryParameter =
    getState().auth.atividade === "contratante" ? "uid" : "uidDiarista";
  const { uid } = getState().auth;
  const servicos = [];
  return servicoRef()
    .where(queryParameter, "==", uid)
    .get()
    .then((collection) => {
      collection.docs.forEach((doc) => servicos.push(doc.data()));
      return servicos;
    });
};
