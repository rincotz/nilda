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

moment.locale("pt-br");

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
      .collection("incompletos")
      .doc(user.uid)
      .set(user)
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

export const stageService = (service) => {
  return (dispatch) => {
    dispatch({ type: constants.STAGE_SERVICE, service });
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
    return clientGeocodeParams(user, key)
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
  if (diferenca < 6) {
    return proximoDia.add(7, "days");
  } else {
    return proximoDia;
  }
};

export const hirerCard = (hirer) => ({
  foto: hirer.foto || "",
  genero: hirer.genero,
  meioDeContatoPreferido: hirer.meioDeContatoPreferido,
  nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
  nome: hirer.nome,
  telefone: hirer.telefone,
  uid: hirer.uid,
});

export const hirerInfo = (hirer, service) => ({
  atividade: "contratante",
  avaliacoes: [],
  cpf: hirer.cpf,
  criada: moment().valueOf(),
  endereco: {
    bairro: hirer.bairro,
    cep: hirer.cep,
    cidade: hirer.cidade,
    complemento: hirer.complemento,
    coordinates: hirer.coordinates,
    estado: hirer.estado,
    logradouro: hirer.logradouro,
    numero: hirer.numero,
    numeroDeComodos: service.numeroDeComodos,
    tipoDeHabitacao: service.tipoDeHabitacao,
  },
  email: hirer.email,
  foto: hirer.foto || "",
  genero: hirer.genero,
  meioDeContatoPreferido: hirer.meioDeContatoPreferido,
  nascimentoDDMMAAAA: hirer.nascimentoDDMMAAAA,
  nome: hirer.nome,
  telefone: hirer.telefone,
  uid: hirer.uid,
  ultimoPgto: "",
});

export const serviceCard = (hirer, service, scheduler) => ({
  agendamento: scheduler(service.diaAgendado).valueOf(),
  bairro: hirer.bairro,
  cep: hirer.cep,
  cidade: hirer.cidade,
  complemento: hirer.complemento,
  contratante: hirerCard(hirer),
  coordinates: hirer.coordinates,
  numeroDeComodos: service.numeroDeComodos,
  criada: moment().valueOf(),
  diaAgendado: service.diaAgendado,
  estado: hirer.estado,
  numeroDiariasEm4Semanas: service.numeroDiariasEm4Semanas,
  horaAgendada: service.horaAgendada,
  logradouro: hirer.logradouro,
  minAgendado: service.minAgendado,
  numero: hirer.numero,
  pgto: "",
  status: "pendente",
  tipoDeHabitacao: service.tipoDeHabitacao,
  trabalhador: "",
  unixStartOfDay: scheduler(service.diaAgendado).startOf("day").valueOf(),
  vencimentoEndOfDay: moment().endOf("day").add(2, "days").valueOf(),
});

export const addHirer = () => {
  return (dispatch, getState) => {
    const hirer = getState().user;
    const service = getState().service;
    const doc = database.collection("servicos").doc();
    const sid = doc.id;
    const cadastroContratante = () =>
      database
        .collection("contratantes")
        .doc(hirer.uid)
        .set({ ...hirerInfo(hirer, service), servicos: [sid] });
    const cadastroEmail = () =>
      auth.currentUser.linkWithCredential(
        firebase.auth.EmailAuthProvider.credential(hirer.email, hirer.senha)
      );
    const cadastroAuth = () =>
      auth.currentUser.updateProfile({
        displayName: `${hirer.atividade} ${hirer.nome}`,
        photoURL: hirer.foto || "",
      });
    const cadastroServicos = () =>
      database
        .collection("servicos")
        .doc(sid)
        .set({ ...serviceCard(hirer, service, minimoAgendamentoMoment), sid });
    return Promise.all([
      cadastroContratante(),
      cadastroEmail(),
      cadastroAuth(),
      cadastroServicos(),
    ])
      .then(() => {
        dispatch(
          stageService(serviceCard(hirer, service, minimoAgendamentoMoment))
        );
        analytics.logEvent(constants.ADD_USER_SUCCESS, { user: hirer.uid });
        return database.collection("incompletos").doc(hirer.uid).delete();
      })
      .catch((error) =>
        analytics.logEvent(constants.ADD_USER_FAIL, {
          user: hirer.uid,
          error: error.message,
        })
      );
  };
};

const workerCard = (worker) => ({
  agendamentos: [],
  cnpjVerificado: false,
  contratantes: [],
  disponibilidade: 4,
  uid: worker.uid,
  nome: worker.nome,
  genero: worker.genero,
  coordinates: worker.coordinates,
  meioDeContatoPreferido: worker.meioDeContatoPreferido,
  nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
  servicos: [],
  foto: worker.foto || "",
  telefone: worker.telefone,
});

const conversionCard = (worker) => ({
  uid: worker.uid,
  nome: worker.nome,
  coordinates: worker.coordinates,
  telefone: worker.telefone,
  meioDeContatoPreferido: worker.meioDeContatoPreferido,
  nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
  genero: worker.genero,
  ferias: worker.ferias,
  decT: worker.decT,
  planoSaude: worker.planoSaude,
  cnpjVerificado: false,
});

const workerInfo = (worker) => ({
  agenda: {
    seg: worker.diasLivres[0] ? 4 : 0,
    ter: worker.diasLivres[1] ? 4 : 0,
    qua: worker.diasLivres[2] ? 4 : 0,
    qui: worker.diasLivres[3] ? 4 : 0,
    sex: worker.diasLivres[4] ? 4 : 0,
    sab: worker.diasLivres[5] ? 4 : 0,
    dom: worker.diasLivres[6] ? 4 : 0,
  },
  atividade: "diarista",
  avaliacoes: [],
  cnpj: worker.cnpj,
  cpf: worker.cpf,
  criada: moment().valueOf(),
  decT: worker.decT,
  diasTrab: 0,
  endereco: {
    bairro: worker.bairro,
    cep: worker.cep,
    cidade: worker.cidade,
    complemento: worker.complemento,
    coordinates: worker.coordinates,
    estado: worker.estado,
    logradouro: worker.logradouro,
    numero: worker.numero,
  },
  email: worker.email,
  ferias: worker.ferias,
  foto: worker.foto || "",
  genero: worker.genero,
  meioDeContatoPreferido: worker.meioDeContatoPreferido,
  nascimentoDDMMAAAA: worker.nascimentoDDMMAAAA,
  nome: worker.nome,
  planoSaude: worker.planoSaude,
  servicosRealizados: [],
  telefone: worker.telefone,
  uid: worker.uid,
  cnpjVerificado: false,
});

export const addWorker = () => {
  return (dispatch, getState) => {
    const worker = getState().user;
    const diasConversao = worker.diasOcup.filter(Boolean).length;
    dispatch(stageUser({ diasConversao, ...workerInfo(worker) }));
    const cadastroDiarista = () => {
      database
        .collection("diaristas")
        .doc(worker.uid)
        .set({ diasConversao, ...workerInfo(worker) });
    };
    const cadastroEmail = () =>
      auth.currentUser.linkWithCredential(
        firebase.auth.EmailAuthProvider.credential(worker.email, worker.senha)
      );
    const cadastroAuth = () =>
      auth.currentUser.updateProfile({
        displayName: `${worker.atividade} ${worker.nome}`,
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
              .set(workerCard(worker))
          );
        return promiseArray;
      });
    const cadastroConversao = () =>
      diasConversao &&
      database
        .collection("conversao")
        .doc(worker.uid)
        .set({
          diasConversao,
          ...conversionCard(worker),
        });
    return Promise.all([
      cadastroDiarista(),
      cadastroEmail(),
      cadastroAuth(),
      ...cadastroDisponibilidade(),
      cadastroConversao(),
    ])
      .then(() => {
        return database
          .collection("incompletos")
          .doc(worker.uid)
          .delete()
          .then(() =>
            analytics.logEvent(constants.ADD_USER_SUCCESS, { user: worker.uid })
          )
          .catch((error) =>
            analytics.logEvent(constants.DELETE_INCOMPLETE_FAIL, {
              user: worker.uid,
              error: error.message,
            })
          );
      })
      .catch((error) =>
        analytics.logEvent(constants.ADD_USER_FAIL, {
          user: worker.uid,
          error: error.message,
        })
      );
  };
};

export const getWorkers = () => {
  return (dispatch, getState) => {
    const workers = [];
    const service = getState().service;
    return geofirestore
      .collection(service.diaAgendado)
      .near({ center: service.coordinates, radius: 10 })
      .get()
      .then((workersData) => {
        workersData.docs.map((worker) =>
          workers.push({
            ...worker.data(),
            distance: worker.distance,
          })
        );
        return workers;
      });
  };
};

export const aceitarDiarista = (worker) => {
  return (dispatch, getState) => {
    const service = getState().service;
    const workerAvailabilityRef = database
      .collection(service.diaAgendado)
      .doc(worker.uid);
    const serviceRef = database.collection("servicos").doc(service.sid);
    return database.runTransaction((transaction) => {
      return transaction.get(workerAvailabilityRef).then((res) => {
        const newAvailability =
          res.data().disponibilidade - service.numeroDiariasEm4Semanas;
        const agendamentos = res.data().agendamentos;
        const contratantes = res.data().contratantes;
        let diaMinimo = minimoAgendamentoMoment(service.diaAgendado);
        const diaAgendado = () => {
          while (agendamentos.indexOf(diaMinimo) !== -1) {
            newAvailability === 2 && service.numeroDiariasEm4Semanas === 1
              ? diaMinimo.add(14, "days")
              : diaMinimo.add(7, "days");
          }
          return diaMinimo.dayOfYear();
        };
        agendamentos.push(diaAgendado());
        contratantes.push(service.contratante.uid);
        transaction.update(serviceRef, { diarista: worker.uid });
        transaction.update(workerAvailabilityRef, {
          agendamentos,
          disponibilidade: newAvailability,
          contratantes,
        });
      });
    });
  };
};
