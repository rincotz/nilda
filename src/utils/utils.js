import moment from "moment";
import "moment/locale/pt-br";
import * as regrasNegocio from "./BusinessRules";

moment.locale("pt-br");

export const semanaArray = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

export const capitalizeFirstLetter = (str) =>
  `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;

export const capitalizeAll = (str, sliceAt = 0) =>
  str
    .split(" ")
    .slice(sliceAt)
    .map((subStr) => capitalizeFirstLetter(subStr))
    .join(" ");

export const getAge = (birthDate) =>
  moment().diff(moment(birthDate, "DDMMYYYY"), "years", false);

export const getPeriodicity = (numeroDiariasEm4Semanas) => {
  switch (numeroDiariasEm4Semanas) {
    case 1:
      return "mensal";
    case 2:
      return "quinzenal";
    case 4:
      return "semanal";
  }
};

export const getStatus = (status) => {
  switch (status) {
    case regrasNegocio.EXECUCAO:
      return "agendado";
    case regrasNegocio.VENCIMENTO1:
      return "aguardando pgto";
    case regrasNegocio.VENCIMENTO2:
      return "aguardando pgto";
    case regrasNegocio.CANCELADO:
      return "cancelado";
  }
};

export const filterState = (state, filter = []) => {
  const filteredObject = {};
  const keys = Object.keys(state);
  const filteredKeys = keys.filter((key) => !filter.includes(key));
  filteredKeys.forEach(
    (filteredKey) => (filteredObject[filteredKey] = state[filteredKey])
  );
  return filteredObject;
};

export const normalizeData = (data) =>
  data
    .normalize("NFD")
    .replace(/([^0-9a-zA-Z\s])/g, "")
    .toLowerCase();

export const bancos = [
  { nome: "Banco do Brasil (BB)", codigo: "001" },
  { nome: "Bradesco", codigo: "237" },
  { nome: "Digio", codigo: "335" },
  { nome: "Nubank", codigo: "260" },
  { nome: "Pagseguro", codigo: "290" },
  { nome: "Mercado Pago", codigo: "323" },
  { nome: "Next", codigo: "237" },
  { nome: "Sofisa", codigo: "637" },
  { nome: "Inter", codigo: "077" },
  { nome: "Itaú", codigo: "341" },
  { nome: "Santander", codigo: "033" },
  { nome: "Original", codigo: "212" },
  { nome: "Bancoob", codigo: "756" },
  { nome: "Banco Votorantim", codigo: "655" },
  { nome: "Neon", codigo: "655" },
  { nome: "Safra", codigo: "422" },
  { nome: "Sicredi", codigo: "748" },
  { nome: "C6", codigo: "336" },
  { nome: "Digimais", codigo: "654" },
];
