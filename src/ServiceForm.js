import React, { Fragment, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import FormIntro from "./components/FormIntro";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import validator from "./validator";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    flexGrow: 1,
    backGroundColor: theme.palette.paper,
  },
}));

export default (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    agendamentos: [
      {
        horaAgendada: "",
        minAgendado: "",
        diaAgendado: "",
        numeroDiariasEm4Semanas: "",
        nomeDiarista: "",
        celularDiarista: "",
        faxinar: false,
        lavarRoupas: false,
        passarRoupas: false,
      },
    ],
  });

  const semana = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const onScheduleChange = (e, index) => {
    const temporaryObject = {
      ...state.agendamentos[index],
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    };
    const temporaryArray = [...state.agendamentos];
    temporaryArray[index] = temporaryObject;
    const temporaryState = { ...state, agendamentos: [...temporaryArray] };
    setState({ ...temporaryState });
  };

  const verifySchedules = () => {
    var schedules = true;
    !!state.cadastrarDiarista
      ? state.agendamentos.map((agendamento) => {
          if (!agendamento["horaAgendada"]) {
            schedules = false;
          }
          if (!agendamento["minAgendado"]) {
            schedules = false;
          }
          if (!agendamento["diaAgendado"]) {
            schedules = false;
          }
          if (!agendamento["numeroDiariasEm4Semanas"]) {
            schedules = false;
          }
          if (!agendamento["nomeDiarista"]) {
            schedules = false;
          }
          if (!agendamento["celularDiarista"]) {
            schedules = false;
          }
          if (
            [
              agendamento["faxinar"],
              agendamento["lavarRoupas"],
              agendamento["passarRoupas"],
            ].filter(Boolean).length === 0
          ) {
            schedules = false;
          }
        })
      : state.agendamentos.map((agendamento) => {
          if (!agendamento["horaAgendada"]) {
            schedules = false;
          }
          if (!agendamento["minAgendado"]) {
            schedules = false;
          }
          if (!agendamento["diaAgendado"]) {
            schedules = false;
          }
          if (!agendamento["numeroDiariasEm4Semanas"]) {
            schedules = false;
          }
          if (
            [
              agendamento["faxinar"],
              agendamento["lavarRoupas"],
              agendamento["passarRoupas"],
            ].filter(Boolean).length === 0
          ) {
            schedules = false;
          }
        });
    return schedules;
  };

  const normalizeData = (data) =>
    data
      .normalize("NFD")
      .replace(/([^0-9a-zA-Z\s])/g, "")
      .toLowerCase();

  const send = () => {
    if (verifySchedules()) {
      const agendamentosArray = [];
      state.agendamentos.map((agendamento) =>
        agendamentosArray.push({
          horaAgendada: agendamento.horaAgendada,
          minAgendado: agendamento.minAgendado,
          diaAgendado: agendamento.diaAgendado,
          numeroDiariasEm4Semanas: agendamento.numeroDiariasEm4Semanas,
          diarista: {
            nomeDiarista: state.cadastrarDiarista
              ? normalizeData(agendamento.nomeDiarista)
              : "",
            celularDiarista: state.cadastrarDiarista
              ? `+55${normalizeData(agendamento.celularDiarista)}`
              : "",
          },
          faxinar: agendamento.faxinar,
          lavarRoupas: agendamento.lavarRoupas,
          passarRoupas: agendamento.passarRoupas,
        })
      );
      props.cadastroServicos(agendamentosArray).then(() => props.nextStep());
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <FormIntro
        icon={<HomeWorkIcon style={{ fontSize: "40px" }} />}
        title={"Serviço"}
        text={"Nos conte um pouco de que você precisa"}
      />
      <List component={"form"}>
        <ListItem>
          <FormControl component={"fieldset"}>
            <FormLabel component={"legend"}>
              você gostaria de cadastrar ou contratar uma diarista?
            </FormLabel>
            <RadioGroup
              aria-label={"cadastrar diarista"}
              name={"cadastrarDiarista"}
              value={state.cadastrarDiarista}
              onChange={(e) => onChange(e)}
            >
              <FormControlLabel
                value={"sim"}
                control={<Radio />}
                label={"gostaria de cadastrar minha diarista"}
              />
              <FormControlLabel
                value={""}
                control={<Radio />}
                label={"preciso de ajuda para contratar"}
              />
            </RadioGroup>
          </FormControl>
        </ListItem>
        {state.agendamentos.map((agendamento, index) => (
          <Fragment key={index}>
            <ListItem>
              <ListItemText
                secondary={`Diária ${
                  index + 1
                }: Informe dia, frequência, horário e as tarefas desta diária.`}
              />
            </ListItem>
            <ListItem>
              <TextField
                select
                variant="outlined"
                onChange={(e) => onScheduleChange(e, index)}
                name="diaAgendado"
                label="dia"
                value={state.agendamentos[index].diaAgendado || ""}
                style={{ minWidth: 72 }}
                className={classes.input}
              >
                {semana.map((dia, index) => (
                  <MenuItem key={index} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                variant="outlined"
                onChange={(e) => onScheduleChange(e, index)}
                name="numeroDiariasEm4Semanas"
                label="frequência"
                value={state.agendamentos[index].numeroDiariasEm4Semanas || ""}
                style={{ minWidth: 120 }}
              >
                <MenuItem disabled value="">
                  Selecione uma opção:
                </MenuItem>
                <MenuItem value={4}>semanal</MenuItem>
                <MenuItem value={2}>quinzenal</MenuItem>
                <MenuItem value={1}>mensal</MenuItem>
              </TextField>
            </ListItem>
            {state.cadastrarDiarista && (
              <Fragment>
                <ListItem>
                  <TextField
                    error={
                      !!validator.nome(state.agendamentos[index].nomeDiarista)
                    }
                    helperText={validator.nome(
                      state.agendamentos[index].nomeDiarista
                    )}
                    variant="outlined"
                    onChange={(e) => onScheduleChange(e, index)}
                    name="nomeDiarista"
                    label="nome diarista"
                    value={state.agendamentos[index].nomeDiarista || ""}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    error={
                      !!validator.celular(
                        state.agendamentos[index].celularDiarista
                      )
                    }
                    helperText={validator.celular(
                      state.agendamentos[index].celularDiarista
                    )}
                    variant="outlined"
                    onChange={(e) => onScheduleChange(e, index)}
                    name="celularDiarista"
                    label="celular diarista"
                    value={state.agendamentos[index].celularDiarista || ""}
                  />
                </ListItem>
              </Fragment>
            )}
            <ListItem>
              <TextField
                select
                variant="outlined"
                onChange={(e) => onScheduleChange(e, index)}
                name="horaAgendada"
                label="hr entrada"
                value={state.agendamentos[index].horaAgendada || ""}
                style={{ minWidth: 70 }}
                className={classes.input}
              >
                {[6, 7, 8, 9, 10, 11, 12, 13, 14].map((h, i) => (
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
                style={{ minWidth: 70 }}
                className={classes.input}
              >
                {["00", 15, 30, 45].map((m, i) => (
                  <MenuItem key={i} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              {state.agendamentos.length - 1 === index ? (
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
                        nomeDiarista: "",
                        celularDiarista: "",
                        faxinar: false,
                        lavarRoupas: false,
                        passarRoupas: false,
                      });
                      setState({ ...temporaryState });
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={"excluir diária"} placement={"top"}>
                  <IconButton
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
              )}
            </ListItem>
            <ListItem>
              <FormControl
                error={
                  [
                    state.agendamentos[index].faxinar,
                    state.agendamentos[index].lavarRoupas,
                    state.agendamentos[index].passarRoupas,
                  ].filter(Boolean).length > 2
                }
                component={"fieldset"}
                className={""}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.agendamentos[index].faxinar}
                        onChange={(e) => onScheduleChange(e, index)}
                        name={"faxinar"}
                      />
                    }
                    label={"faxinar"}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.agendamentos[index].lavarRoupas}
                        onChange={(e) => onScheduleChange(e, index)}
                        name={"lavarRoupas"}
                      />
                    }
                    label={"lavar roupas"}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.agendamentos[index].passarRoupas}
                        onChange={(e) => onScheduleChange(e, index)}
                        name={"passarRoupas"}
                      />
                    }
                    label={"passar roupas"}
                  />
                </FormGroup>
                <FormHelperText>
                  {[
                    state.agendamentos[index].faxinar,
                    state.agendamentos[index].lavarRoupas,
                    state.agendamentos[index].passarRoupas,
                  ].filter(Boolean).length > 2 &&
                    "Você está contratando uma diária de 8hrs de serviço. O tempo pode não ser suficiente para atender a todas as demandas. Oriente a diarista sobre as prioridades."}
                </FormHelperText>
              </FormControl>
            </ListItem>
          </Fragment>
        ))}
      </List>
      <Button
        disabled={!verifySchedules()}
        variant="contained"
        color={"primary"}
        onClick={() => send()}
      >
        avançar
      </Button>
    </Box>
  );
};
