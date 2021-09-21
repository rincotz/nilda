import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import NildaLogo from "../components/NildaLogo";
import RegisterButtons from "../components/RegisterButtons";
import nilda from "../ilustrations/nilda.png";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  image: { width: "100%" },
  paperBody: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

export const HomePage = ({ auth }) => {
  const classes = useStyles();

  return (
    <Box
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexWrap={"wrap"}
      p={4}
      pt={2}
      px={4}
      bgcolor={"background.paper"}
    >
      <Box mb={4} width={1}>
        <NildaLogo />
      </Box>
      <Box display={{ xs: "block", md: "none" }}>
        <Grid container alignItems={"center"} justify={"center"}>
          <Grid item xs={12} md={6}>
            <img alt={"Nilda Logo"} src={nilda} className={classes.image} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant={"body1"} align={"center"}>
              Somos uma plataforma para contratação de diaristas. <br /> No
              Nilda, acreditamos em relações humanizadas. A pessoa que cuidará
              de sua casa mora próxima a você e poderá contratar plano de saúde,
              férias remuneradas e 13º salário.
              <br />
              A diarista determina quantos dias na semana pode trabalhar e que
              benefícios deseja receber.
              <br />
              Para quem contrata, o valor é fixo de RS 160 por diária,
              independente dos benefícios que a diarista escolheu receber.
            </Typography>
          </Grid>
          <Grid item container xs={12} justify={"flex-end"}>
            <Button
              component={Link}
              to={"/mais"}
              color={"primary"}
              size={"large"}
            >
              saiba mais
            </Button>
          </Grid>
          <Grid item xs={12}>
            <RegisterButtons logged={auth.atividade ? auth.atividade : false} />
          </Grid>
        </Grid>
      </Box>
      <Box
        display={{ xs: "none", md: "flex" }}
        flexWrap={"wrap"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box width={1 / 2}>
          <img alt={"Nilda Logo"} src={nilda} className={classes.image} />
        </Box>
        <Box width={1 / 2}>
          <Box width={1}>
            <Typography variant={"body1"} align={"right"}>
              Somos uma plataforma para contratação de diaristas. <br /> No
              Nilda, acreditamos em relações humanizadas. A pessoa que cuidará
              de sua casa mora próxima a você e poderá contratar plano de saúde,
              férias remuneradas e 13º salário.
              <br />
              A diarista determina quantos dias na semana pode trabalhar e que
              benefícios deseja receber.
              <br />
              Para quem contrata, o valor é fixo de RS 160 por diária,
              independente dos benefícios que a diarista escolheu receber.
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent="flex-end" width={1}>
            <Button
              component={Link}
              to={"/mais"}
              color={"primary"}
              size={"large"}
            >
              saiba mais
            </Button>
          </Box>
          <Box width={1}>
            <RegisterButtons logged={auth.atividade ? auth.atividade : false} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(HomePage);
