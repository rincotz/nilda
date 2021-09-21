import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import validator from "../utils/validator";
import { bancos, normalizeData } from "../utils/utils";
import FormN from "../components/FormN";
import ButtonN from "../components/ButtonN";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import makeStyles from "@material-ui/styles/makeStyles";
import { FormGroup } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formItem: {
    marginBottom: "0.7rem",
  },
}));

export const Mei = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    banco: props.user.banco,
    agencia: props.user.agencia,
    tipoDeConta: props.user.tipoDeConta,
    conta: props.user.conta,
  });

  const onChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const formComplete =
    state.banco &&
    state.agencia &&
    !validator.agencia(state.agencia) &&
    state.tipoDeConta &&
    state.conta &&
    !validator.conta(state.conta);

  const send = () => {
    if (formComplete) {
      props.addWorker({
        ...state,
        agencia: normalizeData(state.agencia),
        conta: normalizeData(state.conta),
      });
      props.nextStep();
    }
  };

  return (
    <FormN
      title="Pagamento"
      text={`O pagamento das diárias é feito através de transferência bancária em até 1 dia após o serviço realizado`}
      icon={<MoneyIcon style={{ fontSize: 50 }} />}
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
      <FormGroup className={classes.formItem}>
        <FormLabel component={"legend"}>tipo de conta</FormLabel>
        <RadioGroup
          row
          aria-label={"tipo de conta"}
          name={"tipoDeConta"}
          value={state.tipoDeConta}
          onChange={(e) => onChange(e)}
        >
          <FormControlLabel
            value={"corrente"}
            control={<Radio />}
            label={"corrente"}
          />
          <FormControlLabel
            value={"poupança"}
            control={<Radio />}
            label={"poupança"}
          />
        </RadioGroup>
      </FormGroup>
      <FormGroup className={classes.formItem}>
        <InputLabel style={{ marginLeft: 16 }} id={"banco"}>
          banco
        </InputLabel>
        <Select
          labelId={"banco"}
          id={"banco"}
          variant={"outlined"}
          onChange={(e) => onChange(e)}
          name={"banco"}
          label={"banco"}
          value={state.banco}
          style={{ minWidth: 210 }}
        >
          <MenuItem disabled value={""}>
            Selecione um banco:
          </MenuItem>
          {bancos.map((banco, index) => (
            <MenuItem key={index} value={banco.nome}>
              {banco.nome}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
      <TextField
        type={"number"}
        error={validator.agencia(state.agencia)}
        helperText={validator.agencia(state.agencia)}
        variant={"outlined"}
        onChange={(e) => onChange(e)}
        name={"agencia"}
        label={"agência"}
        value={state.agencia}
        className={classes.formItem}
      />
      <TextField
        type={"number"}
        error={!!validator.conta(state.conta)}
        helperText={validator.conta(state.conta)}
        variant={"outlined"}
        onChange={(e) => onChange(e)}
        name={"conta"}
        label={`conta ${state.tipoDeConta}`}
        value={state.conta}
        className={classes.formItem}
      />
    </FormN>
  );
};

export default Mei;
