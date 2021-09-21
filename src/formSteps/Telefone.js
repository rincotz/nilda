import React from "react";
import firebase from "firebase/app";
import { auth, phoneAuthProvider } from "../firebase";
import FirebaseUIAuth from "react-firebaseui-localized";
import moment from "moment";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import FormN from "../components/FormN";

moment.locale("pt-br");

export const Telefone = (props) => {
  const text =
    "Isso é importante para lhe enviar avisos sobre seu agendamento.";

  return (
    <FormN
      title="Celular"
      text={text}
      icon={<PhoneIphoneIcon style={{ fontSize: 45 }} />}
      buttonRight={false}
      buttonLeft={false}
    >
      <FirebaseUIAuth
        lang="pt_br"
        version="4.7.3"
        firebase={firebase}
        auth={auth}
        config={{
          callbacks: {
            signInSuccessWithAuthResult: (authResult) => {
              if (authResult.user.email) {
                return props.history.push("/");
              } else {
                props.nextStep();
                props.startStageUser({
                  uid: authResult.user.uid,
                  telefone: authResult.user.phoneNumber,
                });
              }
            },
          },
          signInOptions: [
            {
              provider: phoneAuthProvider,
              whitelistedCountries: ["BR"],
            },
          ],
        }}
      />
    </FormN>
  );
};

export default Telefone;
