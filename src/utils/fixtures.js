import moment from "moment";
import { geoponto } from "../firebase";

moment.locale("br");

export const hirer = {
  atividade: "contratante",
  coordenadas: geoponto(-23.5560666, -46.65556249999999),
  cpf: "099.089.498-37",
  email: "marachelles@hotmail.com",
  bairro: "Pinheiros",
  cep: "00000000",
  cidade: "São Paulo",
  complemento: "",
  estado: "SP",
  foto:
    "https://firebasestorage.googleapis.com/v0/b/nilda-6b3b8.appspot.com/o/fotoPerfil%2F6hbvmpioF3QJs1rjHaSUmUOvWTC2?alt=media&token=bba7439d-85cf-42d1-9b0e-d27f80c85d97",
  logradouro: "Rua Peixoto Gomide",
  numero: "250",
  comodos: 1,
  moradores: 3,
  tipo: "apartamento",
  genero: "feminino",
  nascimentoDDMMAAAA: "24/05/1967",
  nome: "Maria Lúcia da Silva",
  telefone: "+55 (11) 996 508 820",
  senha: "Mara@0",
  uid: "AyDH6Q4P6RPap50R4nfNDDcl36r2",
};

export const worker = {
  atividade: "diarista",
  cnpj: "36.334.352/0001-20",
  coordenadas: geoponto(-23.5674501, -47.2131158),
  cpf: "099.089.498-37",
  decimoTerceiro: true,
  diasFolga: [false, false, false, false, false, false, false],
  diasLivres: [true, true, true, true, true, false, false],
  diasOcup: [false, false, false, false, false, true, true],
  email: "marachelles@hotmail.com",
  foto:
    "https://firebasestorage.googleapis.com/v0/b/nilda-6b3b8.appspot.com/o/fotoPerfil%2FZC1R8NdLnlc6FGQlP6rbjlkVavM2?alt=media&token=d293f99b-e55c-4763-88f8-afdedcd55a89",
  bairro: "Pinheiros",
  cep: "00000000",
  cidade: "São Paulo",
  complemento: "",
  estado: "SP",
  logradouro: "Rua Peixoto Gomide",
  numero: "250",
  comodos: 1,
  moradores: 3,
  tipo: "apartamento",
  faxinar: true,
  ferias: true,
  genero: "feminino",
  lavarRoupas: false,
  nascimentoDDMMAAAA: "24/05/1967",
  nome: "Maria Lúcia da Silva",
  senha: "Mara@0",
  telefone: "+55 (11) 996 508 820",
  uid: "AyDH6Q4P6RPap50R4nfNDDcl36r2",
};

export const services = [
  {
    sid: "E1hGLMco8eS7X0F6wwiF",
    horaAgendada: "10",
    minAgendado: "00",
    diaAgendado: "ter",
    numeroDiariasEm4Semanas: 4,
    faxinar: true,
    lavar: false,
    passar: false,
    cozinhar: false,
    nomeDiarista: "Maria Aparecida",
    celularDiarista: "+55 (22) 222 222 222",
  },
  {
    sid: "QNVsl3yafT8LDRNhTpe7",
    horaAgendada: "10",
    minAgendado: "00",
    diaAgendado: "qui",
    numeroDiariasEm4Semanas: 4,
    nomeDiarista: "Maria Aparecida",
    celularDiarista: "+55 (22) 222 222 222",
    faxinar: true,
    lavar: false,
    passar: false,
    cozinhar: false,
  },
];
