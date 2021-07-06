import React from "react";
import { connect } from "react-redux";
import {
  nextStep,
  previousStep,
  aceitarDiarista,
  getWorkers,
  cadastroServicos,
} from "../actions/users";
import ServiceForm from "../ServiceForm";
import FindWorkers from "../FindWorkers";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const NovaDiaria = (props) => {
  const classes = useStyles();
  const formSteps = [<ServiceForm {...props} />, <FindWorkers {...props} />];

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <MobileStepper
            variant="text"
            steps={formSteps.length}
            position={"static"}
            activeStep={props.step}
          />
        </Grid>
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
  cadastroServicos: (agendamentos) => dispatch(cadastroServicos(agendamentos)),
  getWorkers: (dia, diariasEm4Semanas) =>
    dispatch(getWorkers(dia, diariasEm4Semanas)),
  aceitarDiarista: (worker, index) => dispatch(aceitarDiarista(worker, index)),
});

const mapStateToProps = (state) => ({
  step: state.step,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(NovaDiaria);
