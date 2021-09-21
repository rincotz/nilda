import firebase from "firebase/app";
import moment from "moment";
import "moment/locale/pt-br";
import { Client } from "@googlemaps/google-maps-services-js";
import {
  auth,
  database,
  geofirestore,
  geoponto,
  key,
  storage,
} from "../firebase";
import {
  CLEAR_USER,
  NEW_HIRER_INSTANCE,
  NEW_WORKER_INSTANCE,
  STAGE_USER,
} from "./constants";
import { filterState } from "../utils/utils";
import { cadastroDisponibilidade } from "./services";

moment().locale("pt-br");

export const newUserInstance = (atividade) => ({
  uid: "",
  telefone: "",
  atividade,
  nome: "",
  genero: "",
  nascimentoDDMMAAAA: "",
  meioDeContatoPreferido: "whatsapp",
  cpf: "",
  email: "",
  senha: "",
  foto: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cep: "",
  cidade: "",
  estado: "",
  timestamp: moment().format(),
});

//TODO create formStart/formEnded time or operation to detect avg time use

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const newHirerInstance = () => ({
  type: NEW_HIRER_INSTANCE,
  user: {
    ...newUserInstance("contratante"),
    tipo: "",
    comodos: "",
    moradores: "",
    cadastrarDiarista: "",
  },
});

export const newWorkerInstance = () => ({
  type: NEW_WORKER_INSTANCE,
  user: {
    ...newUserInstance("diarista"),
    cnpj: "",
    cnpjVerificado: false,
    ferias: false,
    decT: false,
    planoSaude: false,
    faxinar: false,
    lavarRoupas: false,
    passarRoupas: false,
    diasOcup: {
      seg: false,
      ter: false,
      qua: false,
      qui: false,
      sex: false,
      sab: false,
      dom: false,
    },
    diasLivres: {
      seg: false,
      ter: false,
      qua: false,
      qui: false,
      sex: false,
      sab: false,
      dom: false,
    },
    diasFolga: {
      seg: false,
      ter: false,
      qua: false,
      qui: false,
      sex: false,
      sab: false,
      dom: false,
    },
    verificador: {
      seg: false,
      ter: false,
      qua: false,
      qui: false,
      sex: false,
      sab: false,
      dom: false,
    },
    banco: "",
    agencia: "",
    tipoDeConta: "corrente",
    conta: "",
  },
});

export const stageUser = (user) => ({
  type: STAGE_USER,
  user,
});

// TODO eliminar senha e verificador do cadastro

export const stageFirebaseUser = (user, isComplete = false, filter = []) =>
  user.coordinates
    ? geofirestore
        .collection(user.atividade)
        .doc(user.uid)
        .update(filterState({ ...user, isComplete }, filter))
        .then((success) => success)
    : database
        .collection(user.atividade)
        .doc(user.uid)
        .update(filterState({ ...user, isComplete }, filter))
        .then((success) => success)
        .catch(() =>
          database
            .collection(user.atividade)
            .doc(user.uid)
            .set(filterState({ ...user, isComplete }, filter))
            .then((success) => success)
            .catch((error) => error)
        );

export const startStageUser = (user, filter = []) => {
  return (dispatch, getState) => {
    return stageFirebaseUser({ ...getState().user, ...user }, false, filter)
      .then(() => {
        dispatch(stageUser(user));
      })
      .catch((error) => error);
  };
};

const geofence = (lat, lng) => {
  const initialCoordinates = [-23.574668, -46.756421];
  return (
    initialCoordinates[0] - 0.00002 > lat > initialCoordinates[0] + 0.0002 &&
    initialCoordinates[1] - 0.0002 > lng > initialCoordinates[1] + 0.0002
  );
};

export const getGeopoint = (user) => {
  return (dispatch, getState) => {
    const client = new Client({});
    const { logradouro, numero, bairro, cidade, estado, cep } = user;
    return client
      .geocode({
        params: {
          address: `${logradouro}, ${numero} ${bairro}, ${cidade} - ${estado} ${cep}`,
          region: "br",
          language: "pt-BR",
          key,
        },
      })
      .then(({ data }) => {
        const { lat, lng } = data.results[0].geometry.location;
        return geoponto(lat, lng);
      })
      .catch((error) => error);
  };
};

export const storePic = (foto) => {
  return (dispatch, getState) => {
    const { uid } = getState().user;
    return storage
      .ref(`fotoPerfil/${uid}`)
      .put(foto)
      .then((res) => res.ref.getDownloadURL())
      .catch((error) => error);
  };
};

export const cadastroEmail = ({ email, senha }) =>
  auth.currentUser.linkWithCredential(
    firebase.auth.EmailAuthProvider.credential(email, senha)
  );

export const cadastroAuth = ({ atividade, nome, foto }) =>
  auth.currentUser.updateProfile(
    foto
      ? {
          displayName: `${atividade} ${nome}`,
          photoURL: foto,
        }
      : {
          displayName: `${atividade} ${nome}`,
        }
  );

// TODO temos 12 diárias disponíveis para os seus dias livres

export const addHirer = (contratante = {}) => {
  return (dispatch, getState) => {
    const hirer = getState().user;
    return auth.currentUser.getIdToken(true).then(() =>
      Promise.all([
        stageFirebaseUser(
          filterState({ ...hirer, ...contratante }, true, [
            "senha",
            "cadastrarDiarista",
          ])
        ),
        cadastroEmail(hirer),
        cadastroAuth(hirer),
      ])
        .then((success) => success)
        .catch((error) => error)
    );
  };
};

export const addWorker = (contratante = {}) => {
  return (dispatch, getState) => {
    const diasConversao =
      Object.values(getState().user.diasOcup).filter(Boolean).length * 4;
    const disponibilidade =
      Object.values(getState().user.diasLivres).filter(Boolean).length * 4;
    const worker = filterState(
      {
        ...getState().user,
        ...contratante,
        diasConversao,
        disponibilidade,
        agendamentos: [],
      },
      ["verificador", "senha"]
    );
    for (const [key, value] of Object.entries(worker.diasLivres)) {
      if (value) {
        worker.diasLivres[key] = 4;
      }
    }
    return auth.currentUser.getIdToken(true).then(() =>
      Promise.all([
        stageFirebaseUser(worker, true, ["verificador", "senha"]),
        dispatch(
          cadastroDisponibilidade({
            ...filterState(worker, [
              "atividade",
              "senha",
              "diasOcup",
              "diasFolga",
              "diasConversao",
              "disponibilidade",
              "verificador",
            ]),
            disponibilidade: 4,
          })
        ),
        cadastroEmail(getState().user),
        cadastroAuth(worker),
      ])
        .then((success) => success)
        .catch((error) => error)
    );
  };
};
