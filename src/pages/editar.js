import React from "react";
import FormIntro from "../components/FormIntro";
import PersonIcon from "@material-ui/icons/Person";

export default () => (
  <FormIntro
    title={"Editar Perfil"}
    text={"Seção disponível em breve"}
    icon={<PersonIcon color={"primary"} style={{ fontSize: 50 }} />}
  />
);
