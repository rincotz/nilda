import React, { Fragment, useState } from "react";
import validator from "../utils/validator";
import TextField from "../components/TextFieldN";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonN from "../components/ButtonN";
import FormN from "../components/FormN";
import makeStyles from "@material-ui/styles/makeStyles";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import { semanaArray } from "../utils/utils";

const useStyles = makeStyles((theme) => ({
  formItem: {
    marginBottom: "0.7rem",
  },
  input: {
    marginRight: theme.spacing(1),
  },
}));

export default (props) => {
  const classes = useStyles();
  const [cadastrarDiarista, setCadastrarDiarista] = useState("");
  const [agendamentos, setAgendamentos] = useState(props.services);

  const onAgendamentoChange = (e, index) => {
    const temporaryObject = {
      ...agendamentos[index],
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    };
    const temporaryArray = [...agendamentos];
    temporaryArray[index] = temporaryObject;
    setAgendamentos(temporaryArray);
  };

  const verifySchedules = () => {
    var schedules = true;
    !!cadastrarDiarista
      ? agendamentos.map((agendamento) => {
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
          if (!agendamento["telefoneDiarista"]) {
            schedules = false;
          }
          if (validator.celular(agendamento["telefoneDiarista"])) {
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
      : agendamentos.map((agendamento) => {
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

  const formComplete = verifySchedules();

  const send = () => {
    if (cadastrarDiarista) {
      props.setStep(3);
      return props.requisicaoCadastro();
    } else {
      agendamentos.forEach((agendamento, index) =>
        props.editService(props.services[index].sid, agendamento)
      );
      props.nextStep();
    }
  };

  return (
    <FormN
      title="Serviço"
      text="Nos conte um pouco sobre o que você precisa"
      icon={<HomeWorkIcon style={{ fontSize: "40px" }} />}
      buttonLeft={
        <ButtonN color="secondary" buttonText="voltar" disabled={true} />
      }
      buttonRight={
        <ButtonN
          color="primary"
          buttonText="avançar"
          disabled={!formComplete}
          onClick={() => send()}
        />
      }
    >
      <FormGroup className={classes.formItem}>
        <FormLabel component={"legend"}>
          você gostaria de cadastrar ou contratar uma diarista?
        </FormLabel>
        <RadioGroup
          aria-label={"cadastrar diarista"}
          name={"cadastrarDiarista"}
          value={cadastrarDiarista}
          onChange={(e) => setCadastrarDiarista(e.target.value)}
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
      </FormGroup>
      <FormGroup>
        {agendamentos.map((agendamento, index) => (
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
                onChange={(e) => onAgendamentoChange(e, index)}
                name="diaAgendado"
                label="dia"
                value={agendamentos[index].diaAgendado}
                style={{ minWidth: 72 }}
                className={classes.input}
              >
                {semanaArray.map((dia, index) => (
                  <MenuItem key={index} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                variant="outlined"
                onChange={(e) => onAgendamentoChange(e, index)}
                name="numeroDiariasEm4Semanas"
                label="frequência"
                value={agendamentos[index].numeroDiariasEm4Semanas}
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
            {cadastrarDiarista && (
              <Fragment>
                <ListItem>
                  <TextField
                    error={!!validator.nome(agendamentos[index].nomeDiarista)}
                    helperText={validator.nome(
                      agendamentos[index].nomeDiarista
                    )}
                    variant="outlined"
                    onChange={(e) => onAgendamentoChange(e, index)}
                    name="nomeDiarista"
                    label="nome diarista"
                    value={agendamentos[index].nomeDiarista}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    error={
                      !!validator.celular(agendamentos[index].telefoneDiarista)
                    }
                    helperText={validator.celular(
                      agendamentos[index].telefoneDiarista
                    )}
                    variant="outlined"
                    onChange={(e) => onAgendamentoChange(e, index)}
                    name="telefoneDiarista"
                    label="celular diarista"
                    value={agendamentos[index].telefoneDiarista}
                  />
                </ListItem>
              </Fragment>
            )}
            <ListItem>
              <TextField
                select
                variant="outlined"
                onChange={(e) => onAgendamentoChange(e, index)}
                name="horaAgendada"
                label="hr entrada"
                value={agendamentos[index].horaAgendada}
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
                onChange={(e) => onAgendamentoChange(e, index)}
                name="minAgendado"
                label="min"
                value={agendamentos[index].minAgendado}
                style={{ minWidth: 70 }}
                className={classes.input}
              >
                {["00", 15, 30, 45].map((m, i) => (
                  <MenuItem key={i} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              {agendamentos.length !== 1 && (
                <Tooltip title={"excluir diária"} placement={"top"}>
                  <IconButton
                    aria-label={"excluir diária"}
                    color={"secondary"}
                    onClick={() => {
                      const temporaryArray = agendamentos;
                      temporaryArray.splice(index, 1);
                      const temporaryState = [...temporaryArray];
                      setAgendamentos(temporaryState);
                      props.deleteService(props.services[index].sid);
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Tooltip>
              )}
              {agendamentos.length - 1 === index && (
                <Tooltip title={"incluir outra diária"} placement={"top"}>
                  <IconButton
                    aria-label={"incluir outra diária"}
                    color={"secondary"}
                    onClick={() => {
                      const temporaryState = agendamentos;
                      temporaryState.push(props.newServiceInstance().service);
                      setAgendamentos([...temporaryState]);
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              )}
            </ListItem>
            <ListItem>
              <FormControl
                error={
                  [
                    agendamentos[index].faxinar,
                    agendamentos[index].lavarRoupas,
                    agendamentos[index].passarRoupas,
                  ].filter(Boolean).length > 2
                }
                component={"fieldset"}
                className={""}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agendamentos[index].faxinar}
                        onChange={(e) => onAgendamentoChange(e, index)}
                        name={"faxinar"}
                      />
                    }
                    label={"faxinar"}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agendamentos[index].lavarRoupas}
                        onChange={(e) => onAgendamentoChange(e, index)}
                        name={"lavarRoupas"}
                      />
                    }
                    label={"lavar roupas"}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agendamentos[index].passarRoupas}
                        onChange={(e) => onAgendamentoChange(e, index)}
                        name={"passarRoupas"}
                      />
                    }
                    label={"passar roupas"}
                  />
                </FormGroup>
                <FormHelperText>
                  {[
                    agendamentos[index].faxinar,
                    agendamentos[index].lavarRoupas,
                    agendamentos[index].passarRoupas,
                  ].filter(Boolean).length > 2 &&
                    "Você está contratando uma diária de 8hrs de serviço. O tempo pode não ser suficiente para atender a todas as demandas. Oriente a diarista sobre as prioridades."}
                </FormHelperText>
              </FormControl>
            </ListItem>
          </Fragment>
        ))}
      </FormGroup>
    </FormN>
  );
};
