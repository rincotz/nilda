import React from "react";
import FormN from "../components/FormN";
import MoneyIcon from "@material-ui/icons/AttachMoney";

export default (props) => (
  <FormN
    title="Cadastro"
    text={`Iremos entrar em contato com o profissional indicado para realizar o cadastro. Assim que estiver tudo pronto, entraremos em contato.`}
    icon={<MoneyIcon style={{ fontSize: 50 }} />}
    buttonLeft={false}
    buttonRight={false}
  >
    <p>Você cadastrou {props.services.length} diárias</p>
  </FormN>
);
