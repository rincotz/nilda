import React from "react";
import FormIntro from "../components/FormIntro";
import ErrorIcon from "@material-ui/icons/Error";

export default () => (
  <FormIntro
    icon={<ErrorIcon color={"secondary"} style={{ fontSize: 75 }} />}
    title={"Ocorrências"}
    text={
      "Quando houver ocorrências associadas a suas diárias elas aparecerão aqui"
    }
  />
);
