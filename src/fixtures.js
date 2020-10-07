export const workerPhoneStep = {
  uid: 'PFUoAxJGXmbFL4ndhVUVfp4mhC43',
  telefone: '+5511992893976',
}

export const workerPersonalInfoStep = {
  ...workerPhoneStep,
  atividade: 'diarista',
  nome: 'lady gaga',
  genero: 'feminino',
  nascimentoDDMMAAAA: '01/01/1990',
  cpf: '355.935.868-02',
  email: 'gaga@hotmail.com',
  senha: 'Gaga@1'
}

export const workerProfilePicStep = {
  ...workerPersonalInfoStep,
  foto: 'https://firebasestorage.googleapis.com/v0/b/nilda-6b3b8.appspot.com/o/fotoPerfil%2FPFUoAxJGXmbFL4ndhVUVfp4mhC43?alt=media&token=78116b67-a261-4582-89bc-ead8295b92ff'
}

export const workerAddressStep = {
  ...workerProfilePicStep,
  logradouro: 'rua mourato coelho',
  numero: 678,
  complemento: '',
  bairro: 'pinheiros',
  cep: '05417-001',
  cidade: 'sao paulo',
  estado: 'sp'
}

export const worker = {
  ...workerAddressStep,
  cnpj: '59.094.910/0001-23',
  ferias: true,
  decT: true,
  planoSaude: true,
  diasOcup: [true, true, true, true, true, false, false],
  diasLivres: [false, false, false, false, false, false, false],
  diasFolga: [false, false, false, false, false, true, true],
}

export const hirerPhoneStep = {
  uid: 'igve3mM44Whes8R9Vc5Qvimssw93',
  telefone: '+5511992893976',
}

export const hirerPersonalInfoStep = {
  ...hirerPhoneStep,
  atividade: 'contratante',
  nome: 'nazaré tedesco',
  genero: 'feminino',
  nascimentoDDMMAAAA: '01/01/1960',
  cpf: '355.935.868-02',
  email: 'nazare@hotmail.com',
  senha: 'Naza@1'
}

export const hirerProfilePicStep = {
  ...hirerPersonalInfoStep,
  foto: 'https://firebasestorage.googleapis.com/v0/b/nilda-6b3b8.appspot.com/o/fotoPerfil%2Figve3mM44Whes8R9Vc5Qvimssw93?alt=media&token=e80e4636-bb85-49f6-9685-c50619bfb9ae'
}

export const hirerAddressStep = {
  ...hirerProfilePicStep,
  logradouro: 'rua alberto faria',
  numero: 678,
  complemento: '',
  bairro: 'alto de pinheiros',
  cep: '05459-000',
  cidade: 'sao paulo',
  estado: 'sp'
}

export const hirer = {
  ...hirerAddressStep,
  numeroDiariasEm4Semanas: 4,
  tipoDeHabitacao: 'apartamento',
  numeroDeComodos: 7,
  horaAgendada: 9,
  minAgendado: '00',
  diaAgendado: 'sex',
}