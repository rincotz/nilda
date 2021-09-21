import React, { useState } from "react";
import TextField from "../components/TextFieldN";
import MenuItem from "@material-ui/core/MenuItem";
import LocationIcon from "@material-ui/icons/LocationOn";
import validator from "../utils/validator";
import { ZipInput } from "../utils/masks";
import estados from "../utils/estados";
import cidades from "../utils/cidades";
import ButtonN from "../components/ButtonN";
import FormN from "../components/FormN";
import makeStyles from "@material-ui/styles/makeStyles";
import { normalizeData } from "../utils/utils";

const useStyles = makeStyles(() => ({
  formItem: {
    marginBottom: "0.7rem",
  },
}));

export default (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    logradouro: props.user.logradouro,
    numero: props.user.numero,
    complemento: props.user.complemento,
    bairro: props.user.bairro,
    cep: props.user.cep,
    cidade: props.user.cidade,
    estado: props.user.estado,
  });
  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });
  const formComplete =
    state.logradouro &&
    !validator.rua(state.logradouro) &&
    state.numero &&
    !validator.rua(state.logradouro) &&
    state.bairro &&
    !validator.bairro(state.bairro) &&
    state.cep &&
    !validator.cep(state.cep) &&
    state.estado &&
    !validator.cidade(cidades[state.estado], state.cidade) &&
    state.cidade;
  const send = () => {
    if (formComplete) {
      props.nextStep();
      props.getGeopoint(state).then((geoponto) => {
        props.startStageUser({
          ...state,
          logradouro: normalizeData(state.logradouro),
          numero: normalizeData(state.numero),
          complemento: state.complemento.toLowerCase(),
          bairro: normalizeData(state.bairro),
          cep: normalizeData(state.cep),
          coordinates: geoponto,
        });
      });
    }
  };

  return (
    <FormN
      title="Endereço"
      text={
        props.user === "contratante"
          ? "Seu endereço será compartilhado somente com a diarista que irá realizar o serviço"
          : "Seu endereço não será compartilhado com outros usuários. Ele será utilizado para mostrar as diárias mais próximas de você"
      }
      icon={<LocationIcon style={{ fontSize: "45px" }} />}
      buttonLeft={
        <ButtonN
          color="secondary"
          buttonText="voltar"
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
        validator={validator.rua(state.logradouro)}
        name="logradouro"
        label="rua"
        value={state.logradouro}
        onChange={(e) => onChange(e)}
        className={classes.formItem}
      />
      <TextField
        validator={validator.numero(state.numero)}
        name="numero"
        label="numero"
        value={state.numero}
        onChange={(e) => onChange(e)}
        className={classes.formItem}
      />
      <TextField
        name="complemento"
        label="complemento"
        value={state.complemento}
        onChange={(e) => onChange(e)}
        className={classes.formItem}
      />
      <TextField
        validator={validator.bairro(state.bairro)}
        name="bairro"
        label="bairro"
        value={state.bairro}
        onChange={(e) => onChange(e)}
        className={classes.formItem}
      />
      <TextField
        validator={validator.cep(state.cep)}
        name="cep"
        label="cep"
        value={state.cep}
        onChange={(e) => onChange(e)}
        InputProps={{ inputComponent: ZipInput }}
        className={classes.formItem}
      />
      {/*TODO colocar label em estado e cidade*/}
      <TextField
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="estado"
        label="estado"
        value={state.estado}
        style={{ minWidth: 210 }}
        className={classes.formItem}
      >
        <MenuItem disabled value="">
          selecione estado
        </MenuItem>
        {estados.map((estado) => (
          <MenuItem index={estado[0]} value={estado[0]}>
            {estado[1]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="cidade"
        label="cidade"
        value={state.cidade}
        style={{ minWidth: 210 }}
        className={classes.formItem}
      >
        <option disabled value="">
          selecione cidade
        </option>
        {state.estado &&
          cidades[state.estado].map((cidade) => (
            <option value={cidade}>{cidade}</option>
          ))}
      </TextField>
    </FormN>
  );
};
