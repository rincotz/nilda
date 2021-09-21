import React, { useEffect, useState } from "react";
import WorkerCard from "./CartaoDiarista";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/CheckCircle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { semanaArray } from "../utils/utils";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "./TextFieldN";

export default (props) => {
  const [diaAgendado, setDiaAgendado] = useState(props.service.diaAgendado);
  const [horaAgendada, setHoraAgendada] = useState(props.service.horaAgendada);
  const [minAgendado, setMinAgendado] = useState(props.service.minAgendado);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setWorkers([]);
    const fetchData = async () => {
      const result = await props.diaristasDisponiveis(
        diaAgendado,
        props.service.numeroDiariasEm4Semanas
      );
      setWorkers(result);
    };
    fetchData().then(() => setLoading(false));
  }, [diaAgendado]);
  return (
    <Box
      boxShadow={2}
      m={"1rem"}
      display={"flex"}
      flexDirection={"column"}
      borderRadius={16}
      maxWidth={"22rem"}
    >
      <Box marginTop={1} marginLeft={1} mb={2}>
        <TextField
          select
          variant="standard"
          onChange={(e) => {
            props.editService(props.service.sid, {
              diaAgendado: e.target.value,
            });
            setDiaAgendado(e.target.value);
          }}
          name="diaAgendado"
          label="dia"
          value={diaAgendado}
          style={{ minWidth: 72 }}
        >
          {semanaArray.map((dia, index) => (
            <MenuItem key={index} value={dia}>
              {dia}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="standard"
          onChange={(e) => {
            props.editService(props.service.sid, {
              horaAgendada: e.target.value,
            });
            setHoraAgendada(e.target.value);
          }}
          name="horaAgendada"
          label="hr entrada"
          value={horaAgendada}
          style={{ minWidth: 70 }}
        >
          {[6, 7, 8, 9, 10, 11, 12, 13, 14].map((h, i) => (
            <MenuItem key={i} value={h}>
              {h}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          variant="standard"
          onChange={(e) => {
            props.editService(props.service.sid, {
              minAgendado: e.target.value,
            });
            setMinAgendado(e.target.value);
          }}
          name="minAgendado"
          label="min"
          value={minAgendado}
          style={{ minWidth: 70 }}
        >
          {["00", 15, 30, 45].map((m, i) => (
            <MenuItem key={i} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box mx={2}>
        {loading ? (
          <CircularProgress color={"primary"} />
        ) : workers.length > 0 ? (
          workers.map((worker, index) => (
            <Box my={1} key={index}>
              <WorkerCard
                worker={worker}
                distance={worker.distancia}
                {...props}
              />
            </Box>
          ))
        ) : (
          "No momento não há diaristas para o dia selecionado. Pressione o botão abaixo e após o pagamento você receberá em até 3 dias os dados da diarista que irá cuidar de sua casa ou seu dinheiro de volta"
        )}
      </Box>
      {!loading && workers.length === 0 && (
        <Box display={"flex"} justifyContent={"flex-end"}>
          <IconButton
            color={"primary"}
            onClick={() => props.agendamentoCompleto(props.service.sid)}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
