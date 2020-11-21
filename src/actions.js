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

export const addPic = (user) => {
  return (dispatch) => {
    return storage
      .ref(`fotoPerfil/${user.uid}`)
      .put(user.pessoais.foto)
      .then((snapshot) =>
        snapshot.ref
          .getDownloadURL()
          .then((foto) =>
            dispatch(
              stageUser({ ...user, pessoais: { ...user.pessoais, foto: foto } })
            )
          )
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
  if (diferenca < 6) {
    return proximoDia.add(7, "days");
  } else {
    return proximoDia;
  }
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
      const sid = getId("servicos");
      servicos.push({ ...agendamento, sid });
      servicosState.push({ ...agendamento, sid });
    });
    const cadastroContratante = (contratante) =>
      database
        .collection("contratantes")
        .doc(hirer.uid)
        .set({
          ...contratante,
          agendamentos: servicos,
          criada: moment().valueOf(),
          ultimoPgo: "",
        });
    const cadastroEmail = () =>
      auth.currentUser.linkWithCredential(
        firebase.auth.EmailAuthProvider.credential(
          hirer.pessoais.email,
          hirer.senha
        )
      );
    const cadastroAuth = () =>
      auth.currentUser.updateProfile({
        displayName: `contratante ${hirer.pessoais.nome}`,
        photoURL: hirer.pessoais.foto || "",
      });
    const cadastroServicos = () => {
      hirer.agendamentos.map((servico, index) =>
        geofirestore
          .collection("servicos")
          .doc(servicos[index])
          .set({
            ...servico,
            sid: servicos[index],
            agendamento: minimoAgendamentoMoment(servico.diaAgendado).valueOf(),
            criada: moment().valueOf(),
            pgto: "",
            vencimento: moment().endOf("day").add(2, "days").valueOf(),
            status: "pendente",
            contratante: {
              ...hirer.pessoais,
              uid: hirer.uid,
            },
            endereco: { ...hirer.enderecos[0] },
            coordinates: hirer.coordinates,
          })
      );
    };
    return Promise.all([
      cadastroContratante(hirer),
      cadastroEmail(),
      cadastroAuth(),
      cadastroServicos(),
    ])
      .then(() => {
        dispatch({
          type: constants.STAGE_USER,
          hirer: { ...hirer, agendamentos: [...servicosState] },
        });
        return database.collection("incompletos").doc(hirer.uid).delete();
      })
      .catch((error) =>
        analytics.logEvent(constants.DELETE_INCOMPLETE_FAIL, {
          user: hirer.uid,
          error: error.message,
        })
      )
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
    const diasConversao = worker.profissionais.diasOcup.filter(Boolean).length;
    const cadastroDiarista = () =>
      database
        .collection("diaristas")
        .doc(worker.uid)
        .set({
          uid: worker.uid,
          diasConversao,
          pessoais: { ...worker.pessoais },
          endereco: { ...worker.enderecos[0] },
          agenda: {
            seg: worker.profissionais.diasLivres[0]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[0]
              ? "ocupada"
              : false,
            ter: worker.profissionais.diasLivres[1]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[1]
              ? "ocupada"
              : false,
            qua: worker.profissionais.diasLivres[2]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[2]
              ? "ocupada"
              : false,
            qui: worker.profissionais.diasLivres[3]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[3]
              ? "ocupada"
              : false,
            sex: worker.profissionais.diasLivres[4]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[4]
              ? "ocupada"
              : false,
            sab: worker.profissionais.diasLivres[5]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[5]
              ? "ocupada"
              : false,
            dom: worker.profissionais.diasLivres[6]
              ? { 1: "", 2: "", 3: "", 4: "" }
              : worker.profissionais.diasOcup[6]
              ? "ocupada"
              : false,
          },
          criada: moment().valueOf(),
          servicosRealizados: [],
          ...worker,
          profissionais: {
            cnpj: worker.profissionais.cnpj,
            cnpjVerificado: false,
            servicosPrestados: [],
            faxinar: worker.profissionais.faxinar,
            cozinhar: worker.profissionais.cozinhar,
            lavarRoupas: worker.profissionais.lavarRoupas,
            passarRoupas: worker.profissionais.passarRoupas,
          },
          beneficios: worker.beneficios,
        });
    const cadastroEmail = () =>
      auth.currentUser.linkWithCredential(
        firebase.auth.EmailAuthProvider.credential(
          worker.pessoais.email,
          worker.senha
        )
      );
    const cadastroAuth = () =>
      auth.currentUser.updateProfile({
        displayName: `diarista ${worker.pessoais.nome}`,
        photoURL: worker.pessoais.foto || "",
      });
    const cadastroDisponibilidade = () =>
      worker.profissionais.diasLivres.filter((day, index) => {
        const promiseArray = [];
        day &&
          promiseArray.push(
            geofirestore
              .collection(semana[index])
              .doc(worker.uid)
              .set({
                uid: worker.uid,
                pessoais: { ...worker.pessoais },
                endereco: {
                  ...worker.enderecos[0],
                },
                profissionais: {
                  cnpj: worker.profissionais.cnpj,
                  cnpjVerificado: false,
                  faxinar: worker.profissionais.faxinar,
                  cozinhar: worker.profissionais.cozinhar,
                  lavarRoupas: worker.profissionais.lavarRoupas,
                  passarRoupas: worker.profissionais.passarRoupas,
                  agendamentos: {},
                  disponibilidade: 4,
                },
                coordinates: worker.coordinates,
              })
          );
        return promiseArray;
      });
    const cadastroConversao = () =>
      diasConversao &&
      database
        .collection("conversao")
        .doc(worker.uid)
        .set({
          uid: worker.uid,
          diasConversao,
          profissionais: {
            cnpj: worker.profissionais.cnpj,
            cnpjVerificado: false,
          },
          beneficios: worker.beneficios,
          pessoais: worker.pessoais,
          endereco: { ...worker.enderecos[0] },
        });
    return Promise.all([
      cadastroDiarista(),
      cadastroEmail(),
      cadastroAuth(),
      ...cadastroDisponibilidade(),
      cadastroConversao(),
    ])
      .then(() => database.collection("incompletos").doc(worker.uid).delete())
      .then(() =>
        analytics.logEvent(constants.ADD_USER_SUCCESS, { user: worker.uid })
      )
      .catch((error) =>
        analytics.logEvent(constants.DELETE_INCOMPLETE_FAIL, {
          user: worker.uid,
          error: error.message,
        })
      )
      .catch((error) =>
        analytics.logEvent(constants.ADD_USER_FAIL, {
          user: worker.uid,
          error: error.message,
        })
      );
  };
};

export const getWorkers2 = (dia, diariasEm4Semanas) => {
  const workers = [];
  return geofirestore
    .collection(dia)
    .near({
      center: geoponto(-23.5839152, -46.7314881),
      radius: 15,
      limit: 5,
    })
    .get()
    .then((workersData) => {
      workersData.docs.map((worker) => {
        if (
          worker.data().profissionais.disponibilidade >= diariasEm4Semanas &&
          worker.data().profissionais.cnpjVerificado
        ) {
          workers.push({ ...worker.data(), distance: worker.distance });
        }
      });
      return workers;
    });
};

export const aceitarDiarista2 = (worker, index) => {
  return (dispatch, getState) => {
    const service = getState().user.agendamentos[index];
    const workerAvailabilityRef = database
      .collection(service.diaAgendado)
      .doc(worker.uid);
    return database.runTransaction((transaction) => {
      return transaction.get(workerAvailabilityRef).then((res) => {
        const newAvailability =
          res.data().profissionais.disponibilidade -
          service.numeroDiariasEm4Semanas;
        const agendamentos = res.data().profissionais.agendamentos;
        let diaMinimo = minimoAgendamentoMoment(service.diaAgendado);
        const diaAgendado = () => {
          while (agendamentos.indexOf(diaMinimo) !== -1) {
            newAvailability === 2 && service.numeroDiariasEm4Semanas === 1
              ? diaMinimo.add(14, "days")
              : diaMinimo.add(7, "days");
          }
          return moment(diaMinimo).valueOf();
        };
        agendamentos.push(diaAgendado());
        transaction.update(workerAvailabilityRef, {
          ...agendamentos,
          disponibilidade: newAvailability,
        });
      });
    });
  };
};

export const aceitarDiarista = (worker) => {
  return (dispatch, getState) => {
    const service = getState().user.agendamentos;
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
