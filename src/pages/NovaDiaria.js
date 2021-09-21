import React from "react";
import { connect } from "react-redux";
import {
  aceitarDiarista,
  cadastroDiarias,
  deleteService,
  diaristasDisponiveis,
  editService,
  newServiceInstance,
  requisicaoCadastro,
} from "../actions/services";
import { nextStep, previousStep, setStep } from "../actions/step";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import EncontrarDiaristas from "../formSteps/EncontrarDiaristas";
import NovoServico from "../components/NovoServico";
import Pagamento from "../formSteps/Pagamento";
import SolicitacaoCadastro from "../formSteps/SolicitacaoCadastro";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const NovaDiaria = (props) => {
  const classes = useStyles();
  const formSteps = [
    <NovoServico {...props} />,
    <EncontrarDiaristas {...props} />,
    <Pagamento {...props} />,
    <SolicitacaoCadastro {...props} />,
  ];

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          {formSteps[props.step]}
        </Grid>
      </Grid>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  setStep: (step) => dispatch(setStep(step)),
  newServiceInstance: () => dispatch(newServiceInstance()),
  editService: (sid, updates) => dispatch(editService(sid, updates)),
  deleteService: (sid) => dispatch(deleteService(sid)),
  cadastroDiarias: () => dispatch(cadastroDiarias()),
  requisicaoCadastro: () => dispatch(requisicaoCadastro()),
  diaristasDisponiveis: (dia, diariasEm4Semanas) =>
    dispatch(diaristasDisponiveis(dia, diariasEm4Semanas)),
  aceitarDiarista: (worker, index) => dispatch(aceitarDiarista(worker, index)),
});

const mapStateToProps = (state) => ({
  services: state.services,
  step: state.step,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(NovaDiaria);
