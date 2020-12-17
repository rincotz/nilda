import React, { useState, useEffect } from "react";
import DayCard from "./components/HirerDayCard";
import { getWorkers } from "./actions";
import Box from "@material-ui/core/Box";

export default (props) => {
  const [agendamentos, setAgendamentos] = useState(props.user.agendamentos);

  useEffect(() => {
    agendamentos.length === 0 && props.nextStep();
  }, [agendamentos]);

  const agendamentoCompleto = (index) => {
    const agendamentosCopy = [...agendamentos];
    agendamentosCopy.splice(index, 1);
    setAgendamentos(agendamentosCopy);
  };

  return (
    <Box>
      {agendamentos.map((agendamento, index) => (
        <DayCard
          index={index}
          agendamento={agendamento}
          aceitarDiarista={props.aceitarDiarista}
          agendamentoCompleto={(i) => agendamentoCompleto(i)}
          getWorkers={getWorkers}
          key={agendamento.sid}
        />
      ))}
    </Box>
  );
};
