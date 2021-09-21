import { database, geofirestore } from "../firebase";

export const contratanteRef = (uid) =>
  database.collection("contratante").doc(uid);

export const contratanteGeoRef = (uid) =>
  geofirestore.collection("contratante").doc(uid);

export const diaristaRef = (uid) => database.collection("diarista").doc(uid);

export const diaristaGeoRef = (uid) =>
  geofirestore.collection("diarista").doc(uid);

export const servicoRef = (sid = null) =>
  sid
    ? database.collection("servicos").doc(sid)
    : database.collection("servicos");

export const cadastroRef = (sid) => database.collection("cadastro").doc(sid);

export const diariaRef = (dia, sid) =>
  database.collection("anuncios").doc("diarias").collection(dia).doc(sid);

export const disponibilidadeRef = (dia, uid) =>
  database.collection("anuncios").doc("diaristas").collection(dia).doc(uid);

export const diariaGeoRef = (dia, sid = null) =>
  sid
    ? geofirestore
        .collection("anuncios")
        .doc("diarias")
        .collection(dia)
        .doc(sid)
    : geofirestore.collection("anuncios").doc("diarias").collection(dia);

export const disponibilidadeGeoRef = (dia, uid = null) =>
  uid
    ? geofirestore
        .collection("anuncios")
        .doc("diaristas")
        .collection(dia)
        .doc(uid)
    : geofirestore.collection("anuncios").doc("diaristas").collection(dia);

export const getSid = () => {
  const doc = database.collection("servicos").doc();
  return doc.id;
};
