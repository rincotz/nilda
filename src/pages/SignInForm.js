import React from "react";
import { connect } from "react-redux";
import {
  aceitarDiarista,
  aceitarServico,
  cadastroDiarias,
  cadastroDisponibilidade,
  deleteService,
  diaristasDisponiveis,
  editService,
  newServiceInstance,
  pesquisaDiarias,
  requisicaoCadastro,
  stageService,
} from "../actions/services";
import {
  addHirer,
  addWorker,
  newHirerInstance,
  newWorkerInstance,
  stageUser,
  startStageUser,
  storePic,
} from "../actions/signIn";
import { nextStep, previousStep, clearStep, setStep } from "../actions/step";
import { getGeopoint } from "../actions/signIn";
import IntroContratante from "../formSteps/IntroContratante";
import IntroDiarista from "../formSteps/IntroDiarista";
import Telefone from "../formSteps/Telefone";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Mei from "../formSteps/Mei";
import Pessoais from "../formSteps/Pessoais";
import Foto from "../formSteps/Foto";
import Endereco from "../formSteps/Endereco";
import EncontrarDiaristas from "../formSteps/EncontrarDiaristas";
import Servico from "../formSteps/Servico";
import Bancarias from "../formSteps/Bancarias";
import Pagamento from "../formSteps/Pagamento";
import SolicitacaoCadastro from "../formSteps/SolicitacaoCadastro";
import Verificacao from "../formSteps/Verificacao";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ContratarForm = (props) => {
  const classes = useStyles();
  const { step, location } = props;
  const pathname = location.pathname.slice(1);
  const formSteps = {
    contratar: [
      <IntroContratante {...props} />,
      <Telefone {...props} />,
      <Pessoais {...props} />,
      <Foto {...props} />,
      <Endereco {...props} />,
      <Servico {...props} />,
      <EncontrarDiaristas {...props} />,
      <Pagamento {...props} />,
      <SolicitacaoCadastro {...props} />,
    ],
    trabalhar: [
      <IntroDiarista {...props} />,
      <Telefone {...props} />,
      <Mei {...props} />,
      <Pessoais {...props} />,
      <Foto {...props} />,
      <Endereco {...props} />,
      <Bancarias {...props} />,
      <Verificacao {...props} />,
    ],
  };

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          {formSteps[pathname][step]}
        </Grid>
      </Grid>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  clearStep: () => dispatch(clearStep()),
  setStep: (step) => dispatch(setStep(step)),
  newWorkerInstance: () => dispatch(newWorkerInstance()),
  newHirerInstance: () => dispatch(newHirerInstance()),
  stageUser: (user) => dispatch(stageUser(user)),
  startStageUser: (user, filter) => dispatch(startStageUser(user, filter)),
  storePic: (foto) => dispatch(storePic(foto)),
  getGeopoint: (user) => dispatch(getGeopoint(user)),
  addHirer: (hirer) => dispatch(addHirer(hirer)),
  addWorker: (worker) => dispatch(addWorker(worker)),
  cadastroDisponibilidade: () => dispatch(cadastroDisponibilidade()),
  newServiceInstance: () => dispatch(newServiceInstance()),
  stageService: (service) => dispatch(stageService(service)),
  editService: (sid, updates) => editService(sid, updates),
  deleteService: (sid) => dispatch(deleteService(sid)),
  cadastroDiarias: () => dispatch(cadastroDiarias()),
  requisicaoCadastro: () => dispatch(requisicaoCadastro()),
  diaristasDisponiveis: (dia, numeroDiariasEm4Semanas) =>
    dispatch(diaristasDisponiveis(dia, numeroDiariasEm4Semanas)),
  pesquisaDiarias: (dia) => dispatch(pesquisaDiarias(dia)),
  aceitarDiarista: (diarista, sid) => dispatch(aceitarDiarista(diarista, sid)),
  aceitarServico: (servico) => dispatch(aceitarServico(servico)),
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  services: state.services,
  step: state.step,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(ContratarForm);
