import React, { useState } from "react";
import { BirthInput, IdInput } from "../utils/masks";
import validator from "../utils/validator";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import makeStyles from "@material-ui/styles/makeStyles";
import FormN from "../components/FormN";
import ButtonN from "../components/ButtonN";
import { normalizeData } from "../utils/utils";

const useStyles = makeStyles((theme) => ({
  formItem: {
    marginBottom: "0.7rem",
  },
}));

export const PersonalInfoStep = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    nome: props.user.nome,
    genero: props.user.genero,
    nascimentoDDMMAAAA: props.user.nascimentoDDMMAAAA,
    meioDeContatoPreferido: props.user.meioDeContatoPreferido,
    cpf: props.user.cpf,
    email: props.user.email,
    senha: props.user.senha,
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const formComplete =
    state.nome &&
    !validator.nome(state.nome) &&
    state.nascimentoDDMMAAAA &&
    !validator.nascimento(state.nascimentoDDMMAAAA) &&
    state.cpf &&
    !validator.cpf(state.cpf) &&
    state.email &&
    !validator.email(state.email) &&
    state.senha &&
    !validator.senha(state.senha);
  const send = () => {
    if (formComplete) {
      props.startStageUser({
        ...state,
        nome: state.nome.toLowerCase(),
        nascimentoDDMMAAAA: normalizeData(state.nascimentoDDMMAAAA),
        cpf: normalizeData(state.cpf),
      });
      props.nextStep();
    }
  };

  return (
    <FormN
      title="Informações Pessoais"
      text="Vamos nos conhecer melhor"
      icon={<AccountCircleIcon style={{ fontSize: 60 }} />}
      buttonLeft={
        <ButtonN
          color="secondary"
          buttonText="voltar"
          disabled={props.user.atividade === "contratante"}
          onClick={() => {
            props.stageUser(state);
            props.previousStep();
          }}
        />
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
      <TextField
        error={!!validator.nome(state.nome)}
        helperText={validator.nome(state.nome)}
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="nome"
        label="nome"
        value={state.nome}
        className={classes.formItem}
      />
      <>
        <FormLabel component={"legend"}>gênero</FormLabel>
        <RadioGroup
          aria-label={"gênero"}
          name={"genero"}
          value={state.genero}
          onChange={(e) => onChange(e)}
          className={classes.formItem}
        >
          <FormControlLabel
            value={"feminino"}
            control={<Radio />}
            label={"feminino"}
          />
          <FormControlLabel
            value={"masculino"}
            control={<Radio />}
            label={"masculino"}
          />
        </RadioGroup>
      </>
      <TextField
        error={!!validator.nascimento(state.nascimentoDDMMAAAA)}
        helperText={validator.nascimento(state.nascimentoDDMMAAAA)}
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="nascimentoDDMMAAAA"
        label="nascimento"
        value={state.nascimentoDDMMAAAA}
        InputProps={{ inputComponent: BirthInput }}
        className={classes.formItem}
      />
      <TextField
        error={!!validator.cpf(state.cpf)}
        helperText={validator.cpf(state.cpf)}
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="cpf"
        label="cpf"
        value={state.cpf}
        InputProps={{ inputComponent: IdInput }}
        className={classes.formItem}
      />
      <TextField
        error={!!validator.email(state.email)}
        helperText={validator.email(state.email)}
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="email"
        label="email"
        value={state.email}
        className={classes.formItem}
      />
      <OutlinedInput
        style={{ maxWidth: 210 }}
        error={!!validator.senha(state.senha)}
        type={mostrarSenha ? "text" : "password"}
        id="standard-adornment-password"
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="senha"
        placeholder="senha"
        value={state.senha}
        className={classes.formItem}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="mostrar/esconder senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {mostrarSenha ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      <InputLabel htmlFor="standard-adornment-password">
        {validator.senha(state.senha)}
      </InputLabel>
    </FormN>
  );
};

export default PersonalInfoStep;
