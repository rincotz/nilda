import React from "react";
import { connect } from "react-redux";
import {
  nextStep,
  previousStep,
  stageUser,
  addPic,
  addGeopoint,
  addHirer,
  getWorkers,
  aceitarDiarista,
  stageService,
} from "../actions";
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
import HirerStep from "../HirerStep";
import ServiceCardList from "../ServiceCardList";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const ContratarForm = (props) => {
  const classes = useStyles();
  const formSteps = [
    <WelcomeHirer {...props} />,
    <PhoneStep {...props} />,
    <PersonalInfoStep {...props} />,
    <ProfilePic {...props} />,
    <AddressStep {...props} />,
    <HirerStep {...props} />,
    <ServiceCardList {...props} />,
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
  stageService: (service) => dispatch(stageService(service)),
  addPic: (userObject) => dispatch(addPic(userObject)),
  addGeopoint: (userObject) => dispatch(addGeopoint(userObject)),
  addHirer: (userObject) => dispatch(addHirer(userObject)),
  getWorkers: (userObject) => dispatch(getWorkers(userObject)),
  aceitarDiarista: (serviceInfo, worker) =>
    dispatch(aceitarDiarista(serviceInfo, worker)),
});

const mapStateToProps = (state) => ({
  step: state.step,
  isNextDisabled: state.isNextDisabled,
  user: state.user,
  service: state.service,
});

// ModalStepper.propTypes = {
//   close: PropTypes.func.isRequired,
//   open: PropTypes.bool.isRequired,
//   step: PropTypes.number.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   previousStep: PropTypes.func.isRequired,
//   addGeopoint: PropTypes.func.isRequired,
//   addHirer: PropTypes.func.isRequired,
//   addPic: PropTypes.func.isRequired,
//   addWorker: PropTypes.func.isRequired,
//   getWorkers: PropTypes.func.isRequired,
//   stageUser: PropTypes.func.isRequired,
//   user: PropTypes.shape({
//     uid: PropTypes.string
//   }).isRequired,
// }

export default connect(mapStateToProps, mapDispatchToProps)(ContratarForm);
