import * as firebase from "firebase";
import moment from "moment";
import "moment/locale/pt-br";
import { Client } from "@googlemaps/google-maps-services-js/dist";
import {
  auth,
  database,
  storage,
  key,
  analytics,
  geoponto,
  geofirestore,
} from "./firebase";
import * as constants from "./constants";
import * as regrasNegocio from "./BusinessRules";

moment.locale("br");

const semana = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export const previousStep = () => {
  return (dispatch) => {
    dispatch({ type: constants.PREVIOUS_STEP });
  };
};

export const nextStep = () => {
  return (dispatch) => {
    dispatch({ type: constants.NEXT_STEP });
  };
};

export const setUser = () => {
  return (dispatch) => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: constants.SET_USER, user });
      } else {
        dispatch({ type: constants.CLEAN_USER });
      }
    });
  };
};

export const authenticate = (email, password) => {
  return (dispatch) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((authToken) => dispatch(setUser(authToken.user)))
      .catch((error) =>
        dispatch({ type: constants.LOGIN_FAIL, error: error.message })
      );
  };
};

export const logout = () => {
  return (dispatch) => {
    return auth.signOut().then(dispatch({ type: constants.CLEAN_USER }));
  };
};

export const stageUser = (user) => {
  return (dispatch) => {
    dispatch({ type: constants.STAGE_USER, user });
    return database
      .collection(`${user.atividade}s`)
      .doc(user.uid)
      .set({ ...user, completo: false })
      .then(() =>
        analytics.logEvent(constants.STAGE_USER_SUCCESS, { user: user.uid })
      )
      .catch((error) =>
        analytics.logEvent(constants.STAGE_USER_FAIL, {
          user: user.uid,
          error: error.message,
        })
      );
  };
};

export const addPic = (user) => {
  return (dispatch) => {
    return storage
      .ref(`fotoPerfil/${user.uid}`)
      .put(user.foto)
      .then((snapshot) =>
        snapshot.ref
          .getDownloadURL()
          .then((foto) => dispatch(stageUser({ ...user, foto })))
      );
  };
};

export const clientGeocodeParams = (user, key) => {
  const client = new Client({});
  const { logradouro, numero, bairro, cidade, estado, cep } = user;
  return client.geocode({
    params: {
      address: `${logradouro}, ${numero} ${bairro}, ${cidade} - ${estado} ${cep}`,
      region: "br",
      language: "pt-BR",
      key,
    },
  });
};

export const addGeopoint = (user) => {
  return (dispatch) => {
    return clientGeocodeParams(user.enderecos[0], key)
      .then(({ data }) => {
        const { lat, lng } = data.results[0].geometry.location;
        dispatch(stageUser({ ...user, coordinates: geoponto(lat, lng) }));
      })
      .catch((error) =>
        analytics.logEvent(constants.GEOLOCATE_FAIL, {
          user: user.uid,
          error: error.message,
        })
      );
  };
};

export const minimoAgendamentoMoment = (diaAgendado) => {
  const proximoDia = moment().weekday(semana.indexOf(diaAgendado) + 7);
  const diferenca = proximoDia.diff(moment(), "days");
  if (diferenca < regrasNegocio.prazoAgendamento) {
    return proximoDia.add(7, "days");
  } else {
    return proximoDia;
  }
};

export const conciliarAgendamentos = (agendamentosAnteriores, diaAgendado) => {
  let diaConciliado = diaAgendado;
  while (
    agendamentosAnteriores.indexOf(diaAgendado) !== -1 &&
    moment(diaAgendado).isSameOrBefore(moment().startOf("day"))
  ) {
    diaConciliado.add(7, "days");
  }
  return moment(diaConciliado).valueOf();
};

export const getId = (collectionName) => {
  const doc = database.collection(collectionName).doc();
  return doc.id;
};

export const addHirer = (hirer) => {
  return (dispatch) => {
    const servicos = [];
    const servicosState = [];
    hirer.agendamentos.map((agendamento, index) => {
      if (agendamento.celularDiarista) {
        const sid = getId("cadastrar");
        servicos.push(sid);
        servicosState.push({ ...agendamento, sid });
      } else {
        const sid = getId(`${agendamento.diaAgendado}Recruta`);
        servicos.push(sid);
        servicosState.push({ ...agendamento, sid });
      }
    });
    const cadastroContratante = (contratante) =>
      database
        .collection("contratantes")
        .doc(hirer.uid)
        .set({
          atividade: hirer.atividade,
          coordinates: hirer.coordinates,
          enderecos: [{ ...hirer.enderecos[0] }],
          cpf: hirer.cpf,
          email: hirer.email,
          foto: hirer.foto,
          genero: hirer.genero,
          meioDeContatoPreferido: hirer.meioDeContatoPreferido,
          nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
          nome: hirer.nome,
          telefone: hirer.telefone,
          uid: hirer.uid,
          criada: moment().valueOf(),
          ultimoPgto: "",
          completo: true,
        });
    const cadastroEmail = () =>
      auth.currentUser.linkWithCredential(
        firebase.auth.EmailAuthProvider.credential(hirer.email, hirer.senha)
      );
    const cadastroAuth = () =>
      auth.currentUser.updateProfile({
        displayName: `contratante ${hirer.nome}`,
        photoURL: hirer.foto || "",
      });
    const cadastroServicos = () => {
      hirer.agendamentos.map((servico, index) =>
        geofirestore
          .collection(
            servico.celularDiarista
              ? "cadastrar"
              : `${servico.diaAgendado}Recruta`
          )
          .doc(servicos[index])
          .set(
            servico.celularDiarista
              ? {
                  ...servico,
                  sid: servicos[index],
                  agendamento: minimoAgendamentoMoment(
                    servico.diaAgendado
                  ).valueOf(),
                  criada: moment().valueOf(),
                  pgto: "",
                  vencimento: moment()
                    .endOf("day")
                    .add(regrasNegocio.prazoAgendamento, "days")
                    .valueOf(),
                  cpf: hirer.cpf,
                  email: hirer.email,
                  foto: hirer.foto,
                  genero: hirer.genero,
                  meioDeContatoPreferido: hirer.meioDeContatoPreferido,
                  nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
                  nome: hirer.nome,
                  telefone: hirer.telefone,
                  uid: hirer.uid,
                  endereco: {
                    bairro: hirer.enderecos[0].bairro,
                    cep: hirer.enderecos[0].cep,
                    cidade: hirer.enderecos[0].cidade,
                    complemento: hirer.enderecos[0].complemento,
                    estado: hirer.enderecos[0].estado,
                    logradoro: hirer.enderecos[0].logradouro,
                    numero: hirer.enderecos[0].numero,
                  },
                  coordinates: hirer.coordinates,
                  diaAgendado: servico.diaAgendado,
                  numeroDeComodos: hirer.enderecos[0].numeroDeComodos,
                  numeroDeMoradores: hirer.enderecos[0].numeroDeMoradores,
                  tipoDeHabitacao: hirer.enderecos[0].tipoDeHabitacao,
                  faxinar: servico.faxinar,
                  horaAgendada: servico.horaAgendada,
                  lavarRoupas: servico.lavarRoupas,
                  minAgendado: servico.minAgendado,
                  numeroDiariasEm4Semanas: servico.numeroDiariasEm4Semanas,
                  passarRoupas: servico.passarRoupas,
                  celularDiarista: servico.celularDiarista,
                  nomeDiarista: servico.nomeDiarista,
                }
              : {
                  ...servico,
                  sid: servicos[index],
                  agendamento: minimoAgendamentoMoment(
                    servico.diaAgendado
                  ).valueOf(),
                  criada: moment().valueOf(),
                  pgto: "",
                  vencimento: moment()
                    .endOf("day")
                    .add(regrasNegocio.prazoAgendamento, "days")
                    .valueOf(),
                  cpf: hirer.cpf,
                  email: hirer.email,
                  foto: hirer.foto,
                  genero: hirer.genero,
                  meioDeContatoPreferido: hirer.meioDeContatoPreferido,
                  nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
                  nome: hirer.nome,
                  telefone: hirer.telefone,
                  uid: hirer.uid,
                  endereco: {
                    bairro: hirer.enderecos[0].bairro,
                    cep: hirer.enderecos[0].cep,
                    cidade: hirer.enderecos[0].cidade,
                    complemento: hirer.enderecos[0].complemento,
                    estado: hirer.enderecos[0].estado,
                    logradoro: hirer.enderecos[0].logradouro,
                    numero: hirer.enderecos[0].numero,
                  },
                  coordinates: hirer.coordinates,
                  diaAgendado: servico.diaAgendado,
                  numeroDeComodos: hirer.enderecos[0].numeroDeComodos,
                  numeroDeMoradores: hirer.enderecos[0].numeroDeMoradores,
                  tipoDeHabitacao: hirer.enderecos[0].tipoDeHabitacao,
                  faxinar: servico.faxinar,
                  horaAgendada: servico.horaAgendada,
                  lavarRoupas: servico.lavarRoupas,
                  minAgendado: servico.minAgendado,
                  numeroDiariasEm4Semanas: servico.numeroDiariasEm4Semanas,
                  passarRoupas: servico.passarRoupas,
                }
          )
      );
    };
    dispatch({
      type: constants.STAGE_USER,
      user: { ...hirer, agendamentos: [...servicosState] },
    });
    return Promise.all([
      cadastroContratante(hirer),
      cadastroEmail(),
      cadastroAuth(),
      cadastroServicos(),
    ])
      .then(() => {
        analytics.logEvent(constants.ADD_USER_SUCCESS, { user: hirer.uid });
      })
      .catch((error) =>
        analytics.logEvent(constants.ADD_USER_FAIL, {
          user: hirer.uid,
          error: error.message,
        })
      );
  };
};

export const addWorker = (worker) => {
  return (dispatch) => {
    const diasConversao = worker.diasOcup.filter(Boolean).length * 4;
    const diasDisponiveis = worker.diasLivres.filter(Boolean).length * 4;
    const cadastroDiarista = () =>
      database
        .collection("diaristas")
        .doc(worker.uid)
        .set({
          uid: worker.uid,
          atividade: worker.atividade,
          agencia: worker.agencia,
          banco: worker.banco,
          conta: worker.conta,
          tipoDeConta: worker.tipoDeConta,
          diasConversao,
          diasDisponiveis,
          cpf: worker.cpf,
          email: worker.email,
          foto: worker.foto,
          genero: worker.genero,
          meioDeContatoPreferido: worker.meioDeContatoPreferido,
          nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
          nome: worker.nome,
          telefone: worker.telefone,
          endereco: { ...worker.enderecos[0] },
          coordinates: worker.coordinates,
          semana: {
            seg: worker.diasLivres[0]
              ? 4
              : worker.diasOcup[0]
              ? "ocupada"
              : false,
            ter: worker.diasLivres[1]
              ? 4
              : worker.diasOcup[1]
              ? "ocupada"
              : false,
            qua: worker.diasLivres[2]
              ? 4
              : worker.diasOcup[2]
              ? "ocupada"
              : false,
            qui: worker.diasLivres[3]
              ? 4
              : worker.diasOcup[3]
              ? "ocupada"
              : false,
            sex: worker.diasLivres[4]
              ? 4
              : worker.diasOcup[4]
              ? "ocupada"
              : false,
            sab: worker.diasLivres[5]
              ? 4
              : worker.diasOcup[5]
              ? "ocupada"
              : false,
            dom: worker.diasLivres[6]
              ? 4
              : worker.diasOcup[6]
              ? "ocupada"
              : false,
          },
          criada: moment().valueOf(),
          cnpj: worker.cnpj,
          cnpjVerificado: false,
          servicosPrestados: [],
          faxinar: worker.faxinar,
          lavarRoupas: worker.lavarRoupas,
          passarRoupas: worker.passarRoupas,
          decT: worker.decT,
          ferias: worker.ferias,
          planoSaude: worker.planoSaude,
          saldoFerias: 0,
          saldoDecT: 0,
          faxinasConcluidas: 0,
          cancelamentos: 0,
          completo: true,
        });
    const cadastroEmail = () =>
      auth.currentUser.linkWithCredential(
        firebase.auth.EmailAuthProvider.credential(worker.email, worker.senha)
      );
    const cadastroAuth = () =>
      auth.currentUser.updateProfile({
        displayName: `diarista ${worker.nome}`,
        photoURL: worker.foto || "",
      });
    const cadastroDisponibilidade = () =>
      worker.diasLivres.filter((day, index) => {
        const promiseArray = [];
        day &&
          promiseArray.push(
            geofirestore
              .collection(semana[index])
              .doc(worker.uid)
              .set({
                coordinates: worker.coordinates,
                endereco: {
                  ...worker.enderecos[0],
                },
                cpf: worker.cpf,
                email: worker.email,
                foto: worker.foto,
                genero: worker.genero,
                meioDeContatoPreferido: worker.meioDeContatoPreferido,
                nacimentDDMMAAAA: worker.nascimentoDDMMAAAA,
                nome: worker.nome,
                telefone: worker.telefone,
                agendamentos: [],
                cnpj: worker.cnpj,
                cnpjVerificado: false,
                faxinar: worker.faxinar,
                lavarRoupas: worker.lavarRoupas,
                passarRoupas: worker.passarRoupas,
                uid: worker.uid,
                disponibilidade: 4,
              })
          );
        return promiseArray;
      });
    dispatch({
      type: constants.STAGE_USER,
      user: worker,
    });
    return Promise.all([
      cadastroDiarista(),
      cadastroEmail(),
      cadastroAuth(),
      ...cadastroDisponibilidade(),
    ])
      .then(() => {
        analytics.logEvent(constants.ADD_USER_SUCCESS, { user: worker.uid });
      })
      .catch((error) =>
        analytics.logEvent(constants.ADD_USER_FAIL, {
          user: worker.uid,
          error: error.message,
        })
      );
  };
};

export const cadastroServicos = (agendamentos) => {
  return (dispatch, getState) => {
    const userUID = getState().user.uid;
    return database
      .collection("contratantes")
      .doc(userUID)
      .get()
      .then((doc) => {
        const hirer = doc.data();
        const servicos = [];
        agendamentos.map((agendamento, index) => {
          if (agendamento.celularDiarista) {
            servicos[index] = {
              ...agendamento,
              sid: getId("cadastrar"),
            };
          } else {
            servicos[index] = {
              ...agendamento,
              sid: getId(`${agendamento.diaAgendado}Recruta`),
            };
          }
        });
        dispatch({
          type: constants.STAGE_USER,
          user: { ...hirer, agendamentos: servicos },
        });
        servicos.map((servico, index) =>
          geofirestore
            .collection(
              servico.celularDiarista
                ? "cadastrar"
                : `${servico.diaAgendado}Recruta`
            )
            .doc(servicos[index].sid)
            .set(
              servico.celularDiarista
                ? {
                    ...servico,
                    sid: servicos[index].sid,
                    agendamento: minimoAgendamentoMoment(
                      servico.diaAgendado
                    ).valueOf(),
                    criada: moment().valueOf(),
                    pgto: "",
                    vencimento: moment()
                      .endOf("day")
                      .add(regrasNegocio.prazoAgendamento, "days")
                      .valueOf(),
                    cpf: hirer.cpf,
                    email: hirer.email,
                    foto: hirer.foto,
                    genero: hirer.genero,
                    meioDeContatoPreferido: hirer.meioDeContatoPreferido,
                    nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
                    nome: hirer.nome,
                    telefone: hirer.telefone,
                    uid: hirer.uid,
                    endereco: {
                      bairro: hirer.enderecos[0].bairro,
                      cep: hirer.enderecos[0].cep,
                      cidade: hirer.enderecos[0].cidade,
                      complemento: hirer.enderecos[0].complemento,
                      estado: hirer.enderecos[0].estado,
                      logradoro: hirer.enderecos[0].logradouro,
                      numero: hirer.enderecos[0].numero,
                    },
                    coordinates: hirer.coordinates,
                    diaAgendado: servico.diaAgendado,
                    numeroDeComodos: hirer.enderecos[0].numeroDeComodos,
                    numeroDeMoradores: hirer.enderecos[0].numeroDeMoradores,
                    tipoDeHabitacao: hirer.enderecos[0].tipoDeHabitacao,
                    faxinar: servico.faxinar,
                    horaAgendada: servico.horaAgendada,
                    lavarRoupas: servico.lavarRoupas,
                    minAgendado: servico.minAgendado,
                    numeroDiariasEm4Semanas: servico.numeroDiariasEm4Semanas,
                    passarRoupas: servico.passarRoupas,
                    celularDiarista: servico.celularDiarista,
                    nomeDiarista: servico.nomeDiarista,
                  }
                : {
                    ...servico,
                    sid: servicos[index].sid,
                    agendamento: minimoAgendamentoMoment(
                      servico.diaAgendado
                    ).valueOf(),
                    criada: moment().valueOf(),
                    pgto: "",
                    vencimento: moment()
                      .endOf("day")
                      .add(regrasNegocio.prazoAgendamento, "days")
                      .valueOf(),
                    cpf: hirer.cpf,
                    email: hirer.email,
                    foto: hirer.foto,
                    genero: hirer.genero,
                    meioDeContatoPreferido: hirer.meioDeContatoPreferido,
                    nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
                    nome: hirer.nome,
                    telefone: hirer.telefone,
                    uid: hirer.uid,
                    endereco: {
                      bairro: hirer.enderecos[0].bairro,
                      cep: hirer.enderecos[0].cep,
                      cidade: hirer.enderecos[0].cidade,
                      complemento: hirer.enderecos[0].complemento,
                      estado: hirer.enderecos[0].estado,
                      logradoro: hirer.enderecos[0].logradouro,
                      numero: hirer.enderecos[0].numero,
                    },
                    coordinates: hirer.coordinates,
                    diaAgendado: servico.diaAgendado,
                    numeroDeComodos: hirer.enderecos[0].numeroDeComodos,
                    numeroDeMoradores: hirer.enderecos[0].numeroDeMoradores,
                    tipoDeHabitacao: hirer.enderecos[0].tipoDeHabitacao,
                    faxinar: servico.faxinar,
                    horaAgendada: servico.horaAgendada,
                    lavarRoupas: servico.lavarRoupas,
                    minAgendado: servico.minAgendado,
                    numeroDiariasEm4Semanas: servico.numeroDiariasEm4Semanas,
                    passarRoupas: servico.passarRoupas,
                  }
            )
        );
      });
  };
};

export const getWorkers = (dia, diariasEm4Semanas) => {
  return (dispatch, getState) => {
    const userGeopoint = getState().user.coordinates;
    const workers = [];
    return geofirestore
      .collection(dia)
      .near({
        center: userGeopoint,
        radius: 15,
        limit: 5,
      })
      .get()
      .then((workersData) => {
        workersData.docs.map((worker) => {
          if (
            worker.data().disponibilidade >= diariasEm4Semanas &&
            worker.data().cnpjVerificado
          ) {
            workers.push({ ...worker.data(), distance: worker.distance });
          }
        });
        return workers;
      });
  };
};

export const aceitarDiarista = (worker, index) => {
  return (dispatch, getState) => {
    const hirer = getState().user;
    const serviceSID = hirer.agendamentos[index].sid;
    const serviceDay = hirer.agendamentos[index].diaAgendado;
    const workerRef = database.collection("diaristas").doc(worker.uid);
    const workerWeekDayRef = database.collection(serviceDay).doc(worker.uid);
    const serviceRef = database.collection("servicos").doc(serviceSID);
    const recruitmentRef = database
      .collection(`${serviceDay}Recruta`)
      .doc(serviceSID);
    return database
      .runTransaction((transaction) => {
        return transaction.get(workerWeekDayRef).then((res) => {
          return transaction.get(recruitmentRef).then((recruitmentRes) => {
            const service = recruitmentRes.data().d;
            const newAvailability =
              res.data().d.disponibilidade - service.numeroDiariasEm4Semanas;
            const preAgendamento = minimoAgendamentoMoment(
              service.diaAgendado
            ).valueOf();
            const agendamentos = res.data().d.agendamentos;
            const diaAgendado = conciliarAgendamentos(
              agendamentos,
              preAgendamento
            );
            agendamentos.push(diaAgendado);
            const path = `semana.${service.diaAgendado}`;
            transaction.update(workerRef, {
              [path]: newAvailability,
              diasDisponiveis: firebase.firestore.FieldValue.increment(
                -service.numeroDiariasEm4Semanas
              ),
            });
            transaction.update(workerWeekDayRef, {
              "d.agendamentos": agendamentos,
              "d.disponibilidade": newAvailability,
            });
            transaction.set(serviceRef, {
              agendamento: service.agendamento,
              cpfContratante: hirer.cpf,
              emailContratante: hirer.email,
              fotoContratante: hirer.foto,
              generoContratante: hirer.genero,
              meioDeContatoPreferidoContratante: hirer.meioDeContatoPreferido,
              nascimentoDDMMAAAAContratante: hirer.nascimentoDDMMAAAA,
              nomeContratante: hirer.nome,
              telefoneContratante: hirer.telefone,
              uidContratante: hirer.uid,
              coordinatesContratante: hirer.coordinates,
              criada: moment().valueOf(),
              diaAgendado: service.diaAgendado,
              celularDiarista: worker.telefone,
              nomeDiarista: worker.nome,
              uidDiarista: worker.uid,
              bairro: hirer.enderecos[0].bairro,
              cep: hirer.enderecos[0].cep,
              cidade: hirer.enderecos[0].cidade,
              complemento: hirer.enderecos[0].complemento,
              estado: hirer.enderecos[0].estado,
              logradouro: hirer.enderecos[0].logradouro,
              numero: hirer.enderecos[0].numero,
              numeroDeComodos: hirer.enderecos[0].numeroDeMoradores,
              numeroDeMoradores: hirer.enderecos[0].numeroDeMoradores,
              tipoDeHabitacao: hirer.enderecos[0].tipoDeHabitacao,
              faxinar: service.faxinar,
              horaAgendada: service.horaAgendada,
              lavarRoupas: service.lavarRoupas,
              minAgendado: service.minAgendado,
              numeroDiariasEm4Semanas: service.numeroDiariasEm4Semanas,
              passarRoupas: service.passarRoupas,
              pgtos: [],
              ultimoPgto: "",
              sid: service.sid,
              status: regrasNegocio.EXECUCAO,
              renovacoes: 0,
              vencimento: moment(service.agendamento)
                .add(regrasNegocio.prazoConfirmacao, "days")
                .valueOf(),
            });
            transaction.delete(recruitmentRef);
          });
        });
      })
      .then(() => {
        return analytics.logEvent("WORKER_PROVISIONED", {
          sid: serviceSID,
          hirer: hirer.uid,
          worker: worker.uid,
        });
      })
      .catch((e) => {
        return analytics.logEvent("WORKER_PROVISION_FAIL", {
          sid: serviceSID,
          hirer: hirer.uid,
          worker: worker.uid,
          error: e.message,
        });
      });
  };
};

export const mostrarDiariasDisponiveis = () => {
  return (dispatch, getState) => {
    const user = getState().user;
    const availableDays = {};
    return database
      .collection("diaristas")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const semana = doc.data().semana;
        const coordinates = doc.data().coordinates;
        dispatch({
          type: constants.STAGE_USER,
          user: { ...doc.data(), coordinates },
        });
        for (const [key, value] of Object.entries(semana)) {
          if (value > 0) {
            availableDays[key] = value;
          }
        }
        return availableDays;
      });
  };
};

export const procurarServicos = (dia, disponibilidade) => {
  return (dispatch, getState) => {
    const coordinates = getState().user.coordinates;
    const servicos = [];
    return geofirestore
      .collection(`${dia}Recruta`)
      .near({ center: coordinates, radius: 15 })
      .get()
      .then((servicesData) => {
        servicesData.docs.map((servico) => {
          if (
            servico.data().pgto &&
            servico.data().numeroDiariasEm4Semanas <= disponibilidade
          ) {
            servicos.push({ ...servico.data(), distance: servico.distance });
          }
        });
        return servicos;
      });
  };
};

export const aceitarServico = (service) => {
  return (dispatch, getState) => {
    console.log(service);
    const worker = getState().user;
    const workerRef = database.collection("diaristas").doc(worker.uid);
    const workerWeekdayRef = database
      .collection(service.diaAgendado)
      .doc(worker.uid);
    const recruitmentRef = database
      .collection(`${service.diaAgendado}Recruta`)
      .doc(service.sid);
    const hirerRef = database.collection("contratantes").doc(service.uid);
    const serviceRef = database.collection("servicos").doc(service.sid);
    return database.runTransaction((transaction) => {
      return transaction.get(hirerRef).then((hirerData) => {
        const hirer = hirerData.data();
        return transaction.get(workerWeekdayRef).then((weekdayRefData) => {
          const weekdayRef = weekdayRefData.data();
          console.log(service);
          if (weekdayRef.d.disponibilidade >= service.numeroDiariasEm4Semanas) {
            transaction.update(workerRef, {
              [`semana.${service.diaAgendado}`]: firebase.firestore.FieldValue.increment(
                -service.numeroDiariasEm4Semanas
              ),
              diasDisponiveis: firebase.firestore.FieldValue.increment(
                -service.numeroDiariasEm4Semanas
              ),
            });
            transaction.update(workerWeekdayRef, {
              "d.disponibilidade": firebase.firestore.FieldValue.increment(
                -service.numeroDiariasEm4Semanas
              ),
            });
            transaction.set(serviceRef, {
              agendamento: service.agendamento,
              cpfContratante: hirer.cpf,
              emailContratante: hirer.email,
              fotoContratante: hirer.foto,
              generoContratante: hirer.genero,
              meioDeContatoPreferidoContratante: hirer.meioDeContatoPreferido,
              nascimentoDDMMAAAAContratante: hirer.nascimentoDDMMAAAA,
              nomeContratante: hirer.nome,
              telefoneContratante: hirer.telefone,
              uidContratante: hirer.uid,
              coordinatesContratante: hirer.coordinates,
              criada: moment().valueOf(),
              diaAgendado: service.diaAgendado,
              celularDiarista: worker.telefone,
              nomeDiarista: worker.nome,
              fotoDiarista: worker.foto,
              uidDiarista: worker.uid,
              bairro: hirer.enderecos[0].bairro,
              cep: hirer.enderecos[0].cep,
              cidade: hirer.enderecos[0].cidade,
              complemento: hirer.enderecos[0].complemento,
              estado: hirer.enderecos[0].estado,
              logradouro: hirer.enderecos[0].logradouro,
              numero: hirer.enderecos[0].numero,
              numeroDeComodos: hirer.enderecos[0].numeroDeMoradores,
              numeroDeMoradores: hirer.enderecos[0].numeroDeMoradores,
              tipoDeHabitacao: hirer.enderecos[0].tipoDeHabitacao,
              faxinar: service.faxinar,
              horaAgendada: service.horaAgendada,
              lavarRoupas: service.lavarRoupas,
              minAgendado: service.minAgendado,
              numeroDiariasEm4Semanas: service.numeroDiariasEm4Semanas,
              passarRoupas: service.passarRoupas,
              pgtos: [],
              ultimoPgto: "",
              sid: service.sid,
              status: regrasNegocio.EXECUCAO,
              renovacoes: 0,
              vencimento: moment(service.agendamento)
                .add(regrasNegocio.prazoConfirmacao, "days")
                .valueOf(),
            });
            transaction.delete(recruitmentRef);
          }
        });
      });
    });
  };
};

export const serviceQuery = () => {
  return (dispatch, getState) => {
    const requerente = getState().user;
    const atividadeRequerente =
      requerente.atividade === "contratante" ? "Contratante" : "Diarista";
    const users = [];
    return database
      .collection("servicos")
      .where(`uid${atividadeRequerente}`, "==", requerente.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        return users;
      });
  };
};
