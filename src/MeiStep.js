import React, { useState } from "react";
import FormIntro from "./components/FormIntro";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import validator from "./validator";
import { CnpjInput } from "./masks";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

export const MeiStep = (props) => {
  const [state, setState] = useState({
    cnpj: props.user.cnpj || "",
    ferias: false,
    decT: false,
    planoSaude: false,
    faxinar: false,
    lavarRoupas: false,
    passarRoupas: false,
    diasOcup: [false, false, false, false, false, false, false],
    diasLivres: [false, false, false, false, false, false, false],
    diasFolga: [false, false, false, false, false, false, false],
    verificador: [false, false, false, false, false, false, false],
  });
  const semana = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

  const onChange = (e) =>
    e.target.type === "checkbox"
      ? setState({ ...state, [e.target.name]: e.target.checked })
      : setState({ ...state, [e.target.name]: e.target.value });
  const servicos = state.faxinar || state.lavarRoupas || state.passarRoupas;
  const formComplete =
    state.verificador.filter(Boolean).length === 7 &&
    state.cnpj &&
    !!!validator.cnpj(state.cnpj) &&
    servicos;
  const normalizeData = (data) =>
    data
      .normalize("NFD")
      .replace(/([^0-9a-zA-Z\s])/g, "")
      .toLowerCase();
  const send = () => {
    if (formComplete) {
      props.stageUser({
        ...props.user,
        ferias: state.ferias,
        decT: state.decT,
        planoSaude: state.planoSaude,
        cnpj: normalizeData(state.cnpj),
        diasLivres: state.diasLivres,
        diasOcup: state.diasOcup,
        diasFolga: state.diasFolga,
        faxinar: state.faxinar,
        lavarRoupas: state.lavarRoupas,
        passarRoupas: state.passarRoupas,
      });
      props.nextStep();
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Box width={8 / 12}>
        <FormIntro
          title={"MEI"}
          text={`Para fazer parte do Nilda você precisa ser registrada como MEI.
           Se você ainda não fez isso clique aqui. 
           É grátis e seu número sai na hora. 
           Não esqueça de anotar o número e volte aqui para realizar o cadastro`}
          icon={<LoyaltyIcon style={{ fontSize: 45 }} />}
        />
      </Box>
      <List>
        <ListItem>
          <TextField
            error={!!validator.cnpj(state.cnpj)}
            helperText={validator.cnpj(state.cnpj)}
            variant="outlined"
            onChange={(e) => onChange(e)}
            name="cnpj"
            label="cnpj"
            value={state.cnpj || ""}
            InputProps={{ inputComponent: CnpjInput }}
          />
        </ListItem>
        <ListItem>
          <FormHelperText>
            Marque caso você queira contratar serviços equivalentes a:
          </FormHelperText>
        </ListItem>
        <ListItem>
          <FormGroup>
            <FormControlLabel
              label="férias"
              control={
                <Checkbox
                  checked={state.ferias}
                  onChange={(e) => onChange(e)}
                  name="ferias"
                />
              }
            />
            <FormControlLabel
              label="13º"
              control={
                <Checkbox
                  checked={state.decT}
                  onChange={(e) => onChange(e)}
                  name="decT"
                />
              }
            />
            <FormControlLabel
              label="plano de saúde"
              control={
                <Checkbox
                  checked={state.planoSaude}
                  onChange={(e) => onChange(e)}
                  name="planoSaude"
                />
              }
            />
          </FormGroup>
        </ListItem>
        <ListItem>
          <FormHelperText>
            Marque os serviços que você deseja prestar:
          </FormHelperText>
        </ListItem>
        <ListItem>
          <FormGroup>
            <FormControlLabel
              label="faxinar"
              control={
                <Checkbox
                  checked={state.faxinar}
                  onChange={(e) => onChange(e)}
                  name="faxinar"
                />
              }
            />
            <FormControlLabel
              label="lavar roupas"
              control={
                <Checkbox
                  checked={state.lavarRoupas}
                  onChange={(e) => onChange(e)}
                  name="lavarRoupas"
                />
              }
            />
            <FormControlLabel
              label="passar roupas"
              control={
                <Checkbox
                  checked={state.passarRoupas}
                  onChange={(e) => onChange(e)}
                  name="passarRoupas"
                />
              }
            />
          </FormGroup>
        </ListItem>
        <ListItem>
          <FormHelperText>
            Marque os dias em que você está trabalhando:
          </FormHelperText>
        </ListItem>
        <ListItem>
          <FormGroup row>
            {state.diasOcup.map((dia, index) => (
              <FormControlLabel
                key={index}
                label={semana[index]}
                control={
                  <Checkbox
                    disabled={
                      state.diasOcup[index] ? false : state.verificador[index]
                    }
                    checked={state.diasOcup[index]}
                    onChange={(e) => {
                      let newArray = [...state.diasOcup];
                      let auxVerificador = [...state.verificador];
                      auxVerificador[index] = e.target.checked;
                      newArray[index] = e.target.checked;
                      setState({
                        ...state,
                        diasOcup: newArray,
                        verificador: auxVerificador,
                      });
                    }}
                    name={`${semana[index]}Ocup`}
                  />
                }
              />
            ))}
          </FormGroup>
        </ListItem>
        <ListItem>
          <FormHelperText>
            Marque os dias em que você não está trabalhando, mas gostaria de
            trabalhar:
          </FormHelperText>
        </ListItem>
        <ListItem>
          <FormGroup row>
            {state.diasLivres.map((dia, index) => (
              <FormControlLabel
                key={index}
                label={semana[index]}
                control={
                  <Checkbox
                    disabled={
                      state.diasLivres[index] ? false : state.verificador[index]
                    }
                    checked={state.diasLivres[index]}
                    onChange={(e) => {
                      let newArray = [...state.diasLivres];
                      let auxVerificador = [...state.verificador];
                      auxVerificador[index] = e.target.checked;
                      newArray[index] = e.target.checked;
                      setState({
                        ...state,
                        diasLivres: newArray,
                        verificador: auxVerificador,
                      });
                    }}
                    name={`${semana[index]}Livre`}
                  />
                }
              />
            ))}
          </FormGroup>
        </ListItem>
        <ListItem>
          <FormHelperText>
            Marque os dias em que você não quer trabalhar:
          </FormHelperText>
        </ListItem>
        <ListItem>
          <FormGroup row>
            {state.diasFolga.map((dia, index) => (
              <FormControlLabel
                key={index}
                label={semana[index]}
                control={
                  <Checkbox
                    disabled={
                      state.diasFolga[index] ? false : state.verificador[index]
                    }
                    checked={state.diasFolga[index]}
                    onChange={(e) => {
                      let newArray = [...state.diasFolga];
                      let auxVerificador = [...state.verificador];
                      auxVerificador[index] = e.target.checked;
                      newArray[index] = e.target.checked;
                      setState({
                        ...state,
                        diasFolga: newArray,
                        verificador: auxVerificador,
                      });
                    }}
                    name={`${semana[index]}Folga`}
                  />
                }
              />
            ))}
          </FormGroup>
        </ListItem>
      </List>
      <Box mb={2}>
        <Button
          disabled={!formComplete}
          variant="contained"
          color={"primary"}
          onClick={() => send()}
        >
          avançar
        </Button>
      </Box>
    </Box>
  );
};

export default MeiStep;
