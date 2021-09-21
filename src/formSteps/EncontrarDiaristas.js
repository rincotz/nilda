import React, { useState, useEffect } from "react";
import CartaoAgrupaDiaristas from "../components/CartaoAgrupaDiaristas";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import FormN from "../components/FormN";

export default (props) => {
  const [agendamentos, setAgendamentos] = useState(props.services);
  const [blockButtons, setBlockButtons] = useState(false);

  useEffect(() => {
    props.services.length === 0 && props.nextStep();
  }, [agendamentos.length]);

  const agendamentoCompleto = (sid) => {
    const agendamentosCopy = [...agendamentos];
    setAgendamentos(
      agendamentosCopy.filter((agendamento) => agendamento.sid !== sid)
    );
  };

  return (
    <FormN
      title="Serviço"
      text={
        "Aqui você escolher entre as diaristas disponíveis para lhe atender nos dias requisitados. Você pode alterar o dia para encontrar diaristas diferentes"
      }
      icon={<HomeWorkIcon style={{ fontSize: "40px" }} />}
      buttonLeft={false}
      buttonRight={false}
    >
      {agendamentos.map((service) => (
        <CartaoAgrupaDiaristas
          service={service}
          agendamentoCompleto={(sid) => {
            if (agendamentos.length === 1) {
              props.nextStep();
              agendamentoCompleto(sid);
            } else {
              agendamentoCompleto(sid);
            }
          }}
          blockButtons={blockButtons}
          setBlockButtons={() => setBlockButtons(!blockButtons)}
          key={service.sid}
          {...props}
        />
      ))}
    </FormN>
  );
};
