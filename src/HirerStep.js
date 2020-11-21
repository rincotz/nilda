import React, { Fragment, useEffect, useState } from "react";
import FormIntro from "./components/FormIntro";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import validator from "./validator";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const HirerStep = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    tipoDeHabitacao: props.user.tipoDeHabitacao || "",
    numeroDeComodos: props.user.numeroDeComodos || "",
    numeroDeMoradores: props.user.numeroDeMoradores || "",
    cadastrarDiarista: "",
    agendamentos: [
      {
        horaAgendada: "",
        minAgendado: "",
        diaAgendado: "",
        numeroDiariasEm4Semanas: "",
        nomeDiarista: "",
        celularDiarista: "",
        faxinar: false,
        lavar: false,
        passar: false,
        cozinhar: false,
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
              agendamento["lavar"],
              agendamento["passar"],
              agendamento["cozinhar"],
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
              agendamento["lavar"],
              agendamento["passar"],
              agendamento["cozinhar"],
            ].filter(Boolean).length === 0
          ) {
            schedules = false;
          }
        });
    return schedules;
  };
  const formComplete =
    state.tipoDeHabitacao &&
    state.numeroDeComodos > 0 &&
    state.numeroDeMoradores > 0 &&
    verifySchedules();
  const normalizeData = (data) =>
    data
      .normalize("NFD")
      .replace(/([^0-9a-zA-Z\s])/g, "")
      .toLowerCase();
  const send = () => {
    if (formComplete) {
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
          lavar: agendamento.lavar,
          passar: agendamento.passar,
          cozinhar: agendamento.cozinhar,
        })
      );
      props.addHirer({
        ...props.user,
        enderecos: [
          {
            ...props.user.enderecos[0],
            tipoDeHabitacao: state.tipoDeHabitacao,
            numeroDeComodos: state.numeroDeComodos,
            numerodeMoradores: state.numeroDeMoradores,
          },
        ],
        agendamentos: agendamentosArray,
      });
      props.nextStep();
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <FormIntro
        icon={<HomeWorkIcon style={{ fontSize: "40px" }} />}
        title={"Serviço"}
        text={"Nos conte um pouco de sua casa e de que você precisa"}
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
            style={{ minWidth: 210 }}
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
        <ListItem>
          <TextField
            error={!!validator.comodos(state.numeroDeMoradores)}
            helperText={validator.comodos(state.numeroDeMoradores)}
            variant="outlined"
            type="number"
            onChange={(e) => onChange(e)}
            name="numeroDeMoradores"
            label="nº de moradores"
            value={state.numeroDeMoradores || ""}
          />
        </ListItem>
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
                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((h, i) => (
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
                        lavar: false,
                        passar: false,
                        cozinhar: false,
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
                    state.agendamentos[index].lavar,
                    state.agendamentos[index].passar,
                    state.agendamentos[index].cozinhar,
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
                        checked={state.agendamentos[index].lavar}
                        onChange={(e) => onScheduleChange(e, index)}
                        name={"lavar"}
                      />
                    }
                    label={"lavar roupas"}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.agendamentos[index].passar}
                        onChange={(e) => onScheduleChange(e, index)}
                        name={"passar"}
                      />
                    }
                    label={"passar roupas"}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.agendamentos[index].cozinhar}
                        onChange={(e) => onScheduleChange(e, index)}
                        name={"cozinhar"}
                      />
                    }
                    label={"cozinhar"}
                  />
                </FormGroup>
                <FormHelperText>
                  {[
                    state.agendamentos[index].faxinar,
                    state.agendamentos[index].lavar,
                    state.agendamentos[index].passar,
                    state.agendamentos[index].cozinhar,
                  ].filter(Boolean).length > 2 &&
                    "Você está contratando uma diária de 8hrs de serviço. O tempo pode não ser suficiente para atender a todas as demandas. Oriente a diarista sobre as prioridades."}
                </FormHelperText>
              </FormControl>
            </ListItem>
          </Fragment>
        ))}
      </List>
      <Button
        disabled={!formComplete}
        variant="contained"
        color={"primary"}
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
