import React from "react";
import { Link } from "react-router-dom";
import NildaLogo from "../components/NildaLogo";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import success from "../ilustrations/success.png";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  image: {
    width: "100%",
  },
  button: {
    margin: theme.spacing(4),
  },
}));

export default ({ user }) => {
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
          <img className={classes.image} src={success} alt="fazer parte" />
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
            Obrigado, isso é tudo o que precisávamos.
            <br />
            {`Assim que estiver tudo pronto enviaremos uma mensagem de ${user.meioDeContatoPreferido} e você terá acesso a novos trabalhos`}
          </Box>
          <Button
            to={"/"}
            component={Link}
            className={classes.button}
            color={"secondary"}
            variant={"contained"}
          >
            Concluir
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
