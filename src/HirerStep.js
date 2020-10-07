import React, { Fragment, useState } from "react";
import FormIntro from "./components/FormIntro";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import validator from "./validator";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

export const HirerStep = (props) => {
  const [state, setState] = useState({
    numeroDiariasEm4Semanas: props.user.numeroDiariasEm4Semanas || "",
    tipoDeHabitacao: props.user.tipoDeHabitacao || "",
    numeroDeComodos: props.user.numeroDeComodos || "",
    agendamentos: [
      {
        horaAgendada: "",
        minAgendado: "",
        diaAgendado: "",
        numeroDiariasEm4Semanas: "",
      },
    ],
  });
  const semana = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });
  const onScheduleChange = (e, index) => {
    const temporaryObject = {
      ...state.agendamentos[index],
      [e.target.name]: e.target.value,
    };
    const temporaryArray = [...state.agendamentos];
    temporaryArray[index] = temporaryObject;
    const temporaryState = { ...state, agendamentos: [...temporaryArray] };
    setState({ ...temporaryState });
  };
  const formComplete =
    state.numeroDiariasEm4Semanas &&
    state.tipoDeHabitacao &&
    state.numeroDeComodos > 0 &&
    state.horaAgendada &&
    state.diaAgendado;
  const send = () => {
    if (formComplete) {
      props.addHirer({ ...props.user });
      props.stageService({ ...state });
      props.nextStep();
    }
  };

  return (
    <Box>
      <FormIntro
        icon={<HomeWorkIcon style={{ fontSize: "40px" }} />}
        title={"Serviço"}
        text={"Nos conte um pouco de que você precisa"}
      />
      <List component={"form"}>
        <ListItem>
          <TextField
            select
            variant="outlined"
            onChange={(e) => onChange(e)}
            name="tipoDeHabitacao"
            label="tipo"
            value={state.tipoDeHabitacao || ""}
          >
            <MenuItem disabled value="">
              Selecione uma opção:
            </MenuItem>
            <MenuItem value="apartamento">apartamento</MenuItem>
            <MenuItem value="casa">casa</MenuItem>
            <MenuItem value="comercial">comercial</MenuItem>
          </TextField>
        </ListItem>
        <ListItem>
          <TextField
            error={!!validator.comodos(state.numeroDeComodos)}
            helperText={validator.comodos(state.numeroDeComodos)}
            variant="outlined"
            type="number"
            onChange={(e) => onChange(e)}
            name="numeroDeComodos"
            label="nº de cômodos"
            value={state.numeroDeComodos || ""}
          />
        </ListItem>
        <ListItem></ListItem>
      </List>
      {state.agendamentos.map((agendamento, index) => (
        <Box key={index}>
          <TextField
            select
            variant="outlined"
            onChange={(e) => onScheduleChange(e, index)}
            name="numeroDiariasEm4Semanas"
            label="frequencia"
            value={state.agendamentos[index].numeroDiariasEm4Semanas || ""}
          >
            <MenuItem disabled value="">
              Selecione uma opção:
            </MenuItem>
            <MenuItem value={4}>semanal</MenuItem>
            <MenuItem value={2}>quinzenal</MenuItem>
            <MenuItem value={1}>mensal</MenuItem>
          </TextField>
          <TextField
            select
            variant="outlined"
            onChange={(e) => onScheduleChange(e, index)}
            name="horaAgendada"
            label="hora"
            value={state.agendamentos[index].horaAgendada || ""}
          >
            {[
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
            ].map((h, i) => (
              <MenuItem key={i} value={h}>
                {h}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            variant="outlined"
            onChange={(e) => onScheduleChange(e, index)}
            name="minAgendado"
            label="min"
            value={state.agendamentos[index].minAgendado || ""}
          >
            {["00", 15, 30, 45].map((m, i) => (
              <MenuItem key={i} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            variant="outlined"
            onChange={(e) => onScheduleChange(e, index)}
            name="diaAgendado"
            label="dia"
            value={state.agendamentos[index].diaAgendado || ""}
          >
            {semana.map((dia, index) => (
              <MenuItem key={index} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title={"excluir diária"} placement={"top"}>
            <IconButton
              disabled={index === 0}
              aria-label={"excluir diária"}
              color={"secondary"}
              onClick={() => {
                const temporaryArray = state.agendamentos;
                temporaryArray.splice(index, 1);
                const temporaryState = {
                  ...state,
                  agendamentos: [...temporaryArray],
                };
                setState({ ...temporaryState });
              }}
            >
              <RemoveCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
      <Tooltip title={"incluir outra diária"} placement={"top"}>
        <IconButton
          aria-label={"incluir outra diária"}
          color={"secondary"}
          onClick={() => {
            const temporaryState = { ...state };
            temporaryState.agendamentos.push({
              horaAgendada: "",
              minAgendado: "",
              diaAgendado: "",
              numeroDiariasEm4Semanas: "",
            });
            setState({ ...temporaryState });
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
      <Button
        disabled={!formComplete}
        variant="outlined"
        onClick={() => send()}
      >
        avançar
      </Button>
    </Box>
  );
};

// HirerStep.propTypes = {
//   previousStep: PropTypes.func.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   stageUser: PropTypes.func.isRequired,
//   addHirer: PropTypes.func.isRequired,
//   user: PropTypes.exact({
//     uid: PropTypes.string.isRequired,
//     telefone: PropTypes.string.isRequired,
//     atividade: PropTypes.string.isRequired,
//     nome: PropTypes.string.isRequired,
//     genero: PropTypes.string.isRequired,
//     nascimentoDDMMAAAA: PropTypes.string.isRequired,
//     cpf: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     senha: PropTypes.string.isRequired,
//     foto: PropTypes.string,
//     rua: PropTypes.string.isRequired,
//     numero: PropTypes.string.isRequired,
//     complemento: PropTypes.string,
//     bairro: PropTypes.string.isRequired,
//     cep: PropTypes.string.isRequired,
//     cidade: PropTypes.string.isRequired,
//     estado: PropTypes.string.isRequired
//   }).isRequired
// }

export default HirerStep;
