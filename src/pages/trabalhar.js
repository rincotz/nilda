import React from "react";
import { connect } from "react-redux";
import {
  nextStep,
  previousStep,
  stageUser,
  addPic,
  addGeopoint,
  addWorker,
} from "../actions/users";
import { makeStyles } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import WelcomeHirer from "./welcomeHirer";
import PhoneStep from "../PhoneStep";
import PersonalInfoStep from "../PersonalInfoStep";
import ProfilePic from "../ProfilePicStep";
import AddressStep from "../AddressStep";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import MeiStep from "../MeiStep";
import BankingStep from "../BankingStep";
import WaitingStep from "../WaitingStep";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const TrabalharForm = (props) => {
  const classes = useStyles();
  const formSteps = [
    <WelcomeHirer atividade={"diarista"} {...props} />,
    <PhoneStep atividade={"diarista"} {...props} />,
    <MeiStep atividade={"diarista"} {...props} />,
    <PersonalInfoStep atividade={"diarista"} {...props} />,
    <ProfilePic atividade={"diarista"} {...props} />,
    <AddressStep atividade={"diarista"} {...props} />,
    <BankingStep atividade={"diarista"} {...props} />,
    <WaitingStep atividade={"diarista"} {...props} />,
  ];
  const nextButton = (
    <Button size="small" onClick={() => props.nextStep()}>
      Next
      <KeyboardArrowRight />
    </Button>
  );
  const backButton = (
    <Button
      size="small"
      onClick={() => props.previousStep()}
      disabled={props.step < 1}
    >
      Back
      <KeyboardArrowLeft />
    </Button>
  );

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <MobileStepper
            variant="text"
            steps={formSteps.length}
            position="static"
            activeStep={props.step}
            className={classes.root}
            nextButton={nextButton}
            backButton={backButton}
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
  stageUser: (userObject) => dispatch(stageUser(userObject)),
  addPic: (userObject) => dispatch(addPic(userObject)),
  addGeopoint: (userObject) => dispatch(addGeopoint(userObject)),
  addWorker: (worker) => dispatch(addWorker(worker)),
});

const mapStateToProps = (state) => ({
  step: state.step,
  isNextDisabled: state.isNextDisabled,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(TrabalharForm);
