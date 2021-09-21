import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import validator from "../utils/validator";
import { CnpjInput } from "../utils/masks";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import FormN from "../components/FormN";
import ButtonN from "../components/ButtonN";
import makeStyles from "@material-ui/styles/makeStyles";
import { normalizeData } from "../utils/utils";

const useStyles = makeStyles((theme) => ({
  formItem: {
    marginBottom: "0.7rem",
  },
}));

export const Mei = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    cnpj: props.user.cnpj,
    ferias: props.user.ferias,
    decT: props.user.decT,
    planoSaude: props.user.planoSaude,
    faxinar: props.user.faxinar,
    lavarRoupas: props.user.lavarRoupas,
    passarRoupas: props.user.passarRoupas,
    diasOcup: props.user.diasOcup,
    diasLivres: props.user.diasLivres,
    diasFolga: props.user.diasFolga,
    verificador: props.user.verificador,
  });

  const onChange = (e, stateProperty = null) =>
    stateProperty
      ? setState({
          ...state,
          [stateProperty]: {
            ...state[stateProperty],
            [e.target.name]: e.target.checked,
          },
          verificador: {
            ...state.verificador,
            [e.target.name]: e.target.checked,
          },
        })
      : e.target.type === "checkbox"
      ? setState({ ...state, [e.target.name]: e.target.checked })
      : setState({ ...state, [e.target.name]: e.target.value });

  const servicos = state.faxinar || state.lavarRoupas || state.passarRoupas;

  const formComplete =
    Object.values(state.verificador).filter(Boolean).length === 7 &&
    state.cnpj &&
    !!!validator.cnpj(state.cnpj) &&
    servicos;

  const send = () => {
    if (formComplete) {
      return props
        .startStageUser({ ...state, cnpj: normalizeData(state.cnpj) }, [
          "verificador",
        ])
        .then(() => props.nextStep());
    }
  };

  return (
    <FormN
      title="MEI"
      text={`Você conhece todas as vantagens de ser registrada como MEI?
      Como MEI, você tem direito a aposentadoria por idade, aposentadoria por invalidez, auxílio doença, salário maternidade e pensão por morte para família.
    Se você ainda não fez isso clique aqui.
    A inscrição é gratuita e seu número sai na hora.
    Não esqueça de anotar o número e volte aqui para realizar o cadastro`}
      icon={<LoyaltyIcon style={{ fontSize: 45 }} />}
      buttonLeft={
        <ButtonN
          disabled={true}
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
        error={!!validator.cnpj(state.cnpj)}
        helperText={validator.cnpj(state.cnpj)}
        variant="outlined"
        onChange={(e) => onChange(e)}
        name="cnpj"
        label="cnpj"
        value={state.cnpj}
        InputProps={{ inputComponent: CnpjInput }}
        className={classes.formItem}
      />
      <FormHelperText>
        Marque caso você queira contratar serviços equivalentes a:
      </FormHelperText>
      <FormGroup className={classes.formItem}>
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
      <FormHelperText>
        Marque os serviços que você deseja prestar:
      </FormHelperText>
      <FormGroup className={classes.formItem}>
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
      <FormHelperText>
        Marque os dias em que você está trabalhando:
      </FormHelperText>
      <FormGroup row className={classes.formItem}>
        {Object.entries(state.diasOcup).map(([dia, checked], index) => (
          <FormControlLabel
            key={index}
            label={dia}
            control={
              <Checkbox
                disabled={state.diasOcup[dia] ? false : state.verificador[dia]}
                checked={state.diasOcup[dia]}
                onChange={(e) => onChange(e, "diasOcup")}
                name={dia}
              />
            }
          />
        ))}
      </FormGroup>
      <FormHelperText>
        Marque os dias em que você não está trabalhando, mas gostaria de
        trabalhar:
      </FormHelperText>
      <FormGroup row className={classes.formItem}>
        {Object.entries(state.diasLivres).map(([dia, checked], index) => (
          <FormControlLabel
            key={index}
            label={dia}
            control={
              <Checkbox
                disabled={
                  state.diasLivres[dia] ? false : state.verificador[dia]
                }
                checked={state.diasLivres[dia]}
                onChange={(e) => onChange(e, "diasLivres")}
                name={dia}
              />
            }
          />
        ))}
      </FormGroup>
      <FormHelperText>
        Marque os dias em que você não quer trabalhar:
      </FormHelperText>
      <FormGroup row className={classes.formItem}>
        {Object.entries(state.diasFolga).map(([dia, checked], index) => (
          <FormControlLabel
            key={index}
            label={dia}
            control={
              <Checkbox
                disabled={state.diasFolga[dia] ? false : state.verificador[dia]}
                checked={state.diasFolga[dia]}
                onChange={(e) => onChange(e, "diasFolga")}
                name={dia}
              />
            }
          />
        ))}
      </FormGroup>
    </FormN>
  );
};

export default Mei;
