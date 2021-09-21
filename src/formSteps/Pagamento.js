import React from "react";
import FormN from "../components/FormN";
import ButtonN from "../components/ButtonN";
import * as businessRules from "../utils/BusinessRules";
import MoneyIcon from "@material-ui/icons/AttachMoney";

export default (props) => (
  <FormN
    title="Pagamento"
    text={`Após o pagamento, sua contratação estará concluída. Caso você ainda não tenha uma diarista, em até ${businessRules.prazoAgendamento} dias você receberá o agendamento com os dados da diarista que irá cuidar de sua casa.`}
    icon={<MoneyIcon style={{ fontSize: 50 }} />}
    buttonLeft={false}
    buttonRight={false}
  >
    <p>
      Você contratou {props.services.length} servico(s) no valor total de{" "}
      {props.services.length * businessRules.valorDiaria} reais
    </p>
    <ButtonN onClick={() => props.cadastroDiarias()} buttonText="Pagar" />
  </FormN>
);
