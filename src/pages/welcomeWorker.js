import React from "react";
import NildaLogo from "../components/NildaLogo";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import join from "../ilustrations/join.png";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  image: {
    width: "100%",
  },
  button: {
    margin: theme.spacing(4),
  },
}));

export default ({ nextStep }) => {
  const classes = useStyles();

  return (
    <Box p={4}>
      <Grid
        container
        justify={"center"}
        alignContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={12} md={6}>
          <img className={classes.image} src={join} alt="fazer parte" />
        </Grid>
        <Grid
          item
          container
          justify={"center"}
          alignContent={"center"}
          alignItems={"center"}
          xs={12}
          md={6}
        >
          <NildaLogo subtitle={false} />
          <Box fontWeight={500} textAlign={"center"} pt={4}>
            Obrigado por se interessar em fazer parte.
            <br />
            O Nilda foi desenvolvido pensando em melhorar a vida das diaristas.
            Você escolhe quanto quer trabalhar e que benefícios deseja.
            <br />
            Você cuida das casas das pessoas com carinho, e nós te ajudamos a
            encontrar clientes e contratar benefícios como plano de saúde,
            férias remuneradas e 13º salário.
            <br />
            Para realizar seu cadastro, precisamos de algumas informações sobre
            você e seu cadastro no MEI. É muito rápido, não toma mais do que 5
            minutos.
            <br />
            Pronto pra começar? É só clicar no botão.
          </Box>
          <Button
            onClick={() => nextStep()}
            className={classes.button}
            color={"secondary"}
            variant={"contained"}
          >
            Começar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
