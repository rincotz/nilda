import React from "react";
import { Link } from "react-router-dom";
import FormIntro from "./components/FormIntro";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import EventIcon from "@material-ui/icons/EventAvailable";

export const WaitingStep = (props) => (
  <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
    <Box width={8 / 12}>
      <FormIntro
        title={"Fim"}
        text={`Obrigado, isso é tudo o que precisávamos.
        Assim que estiver tudo pronto enviaremos uma mensagem de ${props.user.meioDeContatoPreferido} e você terá acesso a novos trabalhos.`}
        icon={<EventIcon style={{ fontSize: 45, margin: "auto" }} />}
      />
    </Box>
    <Box mb={2}>
      <Button
        variant={"contained"}
        color={"secondary"}
        component={Link}
        to={"/"}
      >
        concluir
      </Button>
    </Box>
  </Box>
);

export default WaitingStep;
