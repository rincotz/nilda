import React from "react";
import * as firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import moment from "moment";
import Box from "@material-ui/core/Box";
import FormIntro from "./components/FormIntro";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";

moment.locale("pt-br");

export const PhoneStep = (props) => {
  const text =
    "Isso é importante para lhe enviar avisos sobre seu agendamento.";
  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Box width={8 / 12}>
        <FormIntro
          title={"Celular"}
          text={text}
          icon={<PhoneIphoneIcon style={{ fontSize: 45 }} />}
        />
      </Box>
      <Box>
        <StyledFirebaseAuth
          firebaseAuth={firebase.auth()}
          uiConfig={{
            callbacks: {
              signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                if (authResult.user.email) {
                  return props.history.push("/");
                } else {
                  props.nextStep();
                  props.stageUser({
                    uid: authResult.user.uid,
                    telefone: authResult.user.phoneNumber,
                    atividade: props.atividade,
                    diaCadastro: moment.startOf("day"),
                  });
                }
              },
            },
            signInOptions: [
              {
                provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                whitelistedCountries: ["BR"],
              },
            ],
          }}
        />
      </Box>
    </Box>
  );
};

// PhoneStep.propTypes = {
//   close: PropTypes.func.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   stageUser: PropTypes.func.isRequired,
// }

export default PhoneStep;
