import React, { useEffect, useState } from "react";
import DayCard from "./components/DayCard";
import { getWorkers2 } from "./actions";
import Box from "@material-ui/core/Box";

export default (props) => {
  const [agendamentos, setAgendamentos] = useState(
    props.user.agendamentos || [
      {
        diaAgendado: "seg",
        horaAgendada: "09",
        minAgendado: "00",
        numeroDiariasEm4Semanas: 4,
      },
    ]
  );

  const acceptWorker = (service, worker) => {};

  return agendamentos.map((agendamento, index) => (
    <Box key={index}>
      <DayCard
        diaAgendado={agendamento.diaAgendado}
        hora={agendamento.horaAgendada}
        min={agendamento.minAgendado}
        getWorkers={(diaAgendado) =>
          getWorkers2(diaAgendado, agendamento.numeroDiariasEm4Semanas)
        }
      />
    </Box>
  ));
};
