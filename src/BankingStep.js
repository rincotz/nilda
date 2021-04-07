import React, { useState } from "react";
import FormIntro from "./components/FormIntro";
import validator from "./validator";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import MoneyIcon from "@material-ui/icons/AttachMoney";

const bancos = [
  { nome: "Banco do Brasil (BB)", codigo: "001" },
  { nome: "Bradesco", codigo: "237" },
  { nome: "Digio", codigo: "335" },
  { nome: "Nubank", codigo: "260" },
  { nome: "Pagseguro", codigo: "290" },
  { nome: "Mercado Pago", codigo: "323" },
  { nome: "Next", codigo: "237" },
  { nome: "Sofisa", codigo: "637" },
  { nome: "Inter", codigo: "077" },
  { nome: "Itaú", codigo: "341" },
  { nome: "Santander", codigo: "033" },
  { nome: "Original", codigo: "212" },
  { nome: "Bancoob", codigo: "756" },
  { nome: "Banco Votorantim", codigo: "655" },
  { nome: "Neon", codigo: "655" },
  { nome: "Safra", codigo: "422" },
  { nome: "Sicredi", codigo: "748" },
  { nome: "C6", codigo: "336" },
  { nome: "Digimais", codigo: "654" },
];

export const BankingStep = (props) => {
  const [state, setState] = useState({
    banco: "",
    agencia: "",
    tipoDeConta: "corrente",
    conta: "",
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

  const normalizeData = (data) =>
    data
      .normalize("NFD")
      .replace(/([^0-9a-zA-Z\s])/g, "")
      .toLowerCase();

  const send = () => {
    if (formComplete) {
      props.addWorker({
        ...props.user,
        banco: state.banco,
        agencia: normalizeData(state.agencia),
        tipoDeConta: state.tipoDeConta,
        conta: normalizeData(state.conta),
      });
    }
    props.nextStep();
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Box width={8 / 12}>
        <FormIntro
          title={"Pagamento"}
          text={`O pagamento das diárias é feito através de transferência bancária em até 1 dia útil após o serviço realizado.`}
          icon={<MoneyIcon style={{ fontSize: 50 }} />}
        />
      </Box>
      <List>
        <ListItem>
          <FormControl>
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
              value={state.banco || ""}
              style={{ minWidth: 210 }}
            >
              <MenuItem disabled value={""}>
                Selecione um banco:
              </MenuItem>
              {bancos.map((banco, index) => (
                <MenuItem key={index} value={banco.codigo}>
                  {banco.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <TextField
            type={"number"}
            error={validator.agencia(state.agencia)}
            helperText={validator.agencia(state.agencia)}
            variant={"outlined"}
            onChange={(e) => onChange(e)}
            name={"agencia"}
            label={"agência"}
            value={state.agencia || ""}
          />
        </ListItem>
        <ListItem>
          <FormControl component={"fieldset"}>
            <FormLabel component={"legend"}>tipo de conta</FormLabel>
            <RadioGroup
              aria-label={"tipo de conta"}
              name={"tipoDeConta"}
              value={state.tipoDeConta || "corrente"}
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
          </FormControl>
        </ListItem>
        <ListItem>
          <TextField
            type={"number"}
            error={!!validator.conta(state.conta)}
            helperText={validator.conta(state.conta)}
            variant={"outlined"}
            onChange={(e) => onChange(e)}
            name={"conta"}
            label={`conta ${state.tipoDeConta}`}
            value={state.conta || ""}
          />
        </ListItem>
      </List>
      <Box mb={2}>
        <Button
          color={"primary"}
          disabled={!formComplete}
          variant="contained"
          onClick={() => send()}
        >
          avançar
        </Button>
      </Box>
    </Box>
  );
};

export default BankingStep;
