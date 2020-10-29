import React, { useState } from "react";
import { BirthInput, IdInput } from "./masks";
import validator from "./validator";
import FormIntro from "./components/FormIntro";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  input: {
    maxWidth: 210,
  },
}));

export const PersonalInfoStep = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    nome: props.user.nome || "",
    genero: props.user.genero || "",
    nascimentoDDMMAAAA: props.user.nascimentoDDMMAAAA || "",
    meioDeContatoPreferido: props.user.meioDeContatoPreferido || "whatsapp",
    cpf: props.user.cpf || "",
    email: props.user.email || "",
    senha: "",
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
      props.stageUser({ ...props.user, ...state });
      props.nextStep();
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <FormIntro
        title={"Informações Pessoais"}
        text={"Vamos nos conhecer melhor"}
        icon={<AccountCircleIcon style={{ fontSize: 60 }} />}
      />
      <List>
        <ListItem>
          <FormControl>
            <TextField
              error={!!validator.nome(state.nome)}
              helperText={validator.nome(state.nome)}
              variant="outlined"
              onChange={(e) => onChange(e)}
              name="nome"
              label="nome"
              value={state.nome || ""}
            />
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl component={"fieldset"}>
            <FormLabel component={"legend"}>gênero</FormLabel>
            <RadioGroup
              aria-label={"gênero"}
              name={"genero"}
              value={state.genero || ""}
              onChange={(e) => onChange(e)}
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
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl>
            <TextField
              error={!!validator.nascimento(state.nascimentoDDMMAAAA)}
              helperText={validator.nascimento(state.nascimentoDDMMAAAA)}
              variant="outlined"
              onChange={(e) => onChange(e)}
              name="nascimentoDDMMAAAA"
              label="nascimento"
              value={state.nascimentoDDMMAAAA || ""}
              InputProps={{ inputComponent: BirthInput }}
            />
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl component={"fieldset"}>
            <FormLabel component={"legend"}>
              meio de contato preferido
            </FormLabel>
            <RadioGroup
              aria-label={"gênero"}
              name={"meioDeContatoPreferido"}
              value={state.meioDeContatoPreferido || ""}
              onChange={(e) => onChange(e)}
            >
              <FormControlLabel
                value={"whatsapp"}
                control={<Radio />}
                label={"whatsapp"}
              />
              <FormControlLabel
                value={"sms"}
                control={<Radio />}
                label={"sms"}
              />
            </RadioGroup>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl>
            <TextField
              error={!!validator.cpf(state.cpf)}
              helperText={validator.cpf(state.cpf)}
              variant="outlined"
              onChange={(e) => onChange(e)}
              name="cpf"
              label="cpf"
              value={state.cpf || ""}
              InputProps={{ inputComponent: IdInput }}
            />
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl>
            <TextField
              error={!!validator.email(state.email)}
              helperText={validator.email(state.email)}
              variant="outlined"
              onChange={(e) => onChange(e)}
              name="email"
              label="email"
              value={state.email || ""}
            />
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl>
            <OutlinedInput
              className={classes.input}
              error={!!validator.senha(state.senha)}
              type={mostrarSenha ? "text" : "password"}
              id="standard-adornment-password"
              variant="outlined"
              onChange={(e) => onChange(e)}
              name="senha"
              placeholder="senha"
              value={state.senha || ""}
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
          </FormControl>
        </ListItem>
      </List>
      <Button
        color={"primary"}
        variant={"contained"}
        disabled={!formComplete}
        onClick={() => send()}
      >
        avançar
      </Button>
    </Box>
  );
};

// PersonalInfoStep.propTypes = {
//   previousStep: PropTypes.func.isRequired,
//   nextStep: PropTypes.func.isRequired,
//   stageUser: PropTypes.func.isRequired,
//   user: PropTypes.exact({
//     uid: PropTypes.string.isRequired,
//     telefone: PropTypes.string.isRequired
//   }).isRequired
// }

export default PersonalInfoStep;
