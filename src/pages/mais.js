import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Navbar from "../components/Navbar";
import NildaLogo from "../components/NildaLogo";
import RegisterButtons from "../components/RegisterButtons";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import beach from "../ilustrations/beach.png";
import doctor from "../ilustrations/doctor.png";
import money from "../ilustrations/money.png";

const useStyles = makeStyles({
  image: { width: "100%" },
});

const Mais = () => {
  const classes = useStyles();
  return (
    <Box
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexWrap={"wrap"}
      p={4}
      bgcolor={"background.paper"}
    >
      <Navbar />
      <Box mb={4} width={1}>
        <NildaLogo subtitle={false} />
      </Box>
      <Box mb={4} width={1}>
        <Typography variant={"h3"} align={"center"}>
          Como Funciona?
        </Typography>
      </Box>
      <Box display={{ xs: "block", sm: "none" }}>
        <Box width={1}>
          <img src={beach} className={classes.image} />
        </Box>
        <Box width={1}>
          <Typography component={"div"}>
            <Box textAlign={"center"} mb={1} fontWeight={"fontWeightBold"}>
              Férias
            </Box>
            <Box>
              A diarista pode escolher receber no 12º mês o equivalente à média
              dos 11 meses anteriores de serviços prestados, previamente
              descontados, sem precisar trabalhar durante o 12º mês. O
              contratante receberá outro profissional em sua casa neste período
              sem custo adicional.
            </Box>
          </Typography>
        </Box>
        <Box width={1} mt={3}>
          <img src={doctor} className={classes.image} />
        </Box>
        <Box width={1}>
          <Typography>
            <Box textAlign={"center"} mb={1} fontWeight={"fontWeightBold"}>
              Plano de Saúde
            </Box>
            <Box>
              Negociamos tarifas acessíveis com os provedores de planos de
              saúde. Até mesmo diaristas que trabalham apenas 1 vez por semana
              tem condição de contratar um plano.
            </Box>
          </Typography>
        </Box>
        <Box width={1} mt={3}>
          <img src={money} className={classes.image} />
        </Box>
        <Box width={1}>
          <Typography>
            <Box textAlign={"center"} mb={1} fontWeight={"fontWeightBold"}>
              13º
            </Box>
            <Box>
              A diarista pode escolher receber no 12º mês trabalhado, o
              equivalente a média dos últimos onze meses trabalhados,
              previamente descontados.
            </Box>
          </Typography>
        </Box>
        <Box width={1} mt={3}>
          <RegisterButtons />
        </Box>
      </Box>
      <Box display={{ xs: "none", sm: "block" }}>
        <Grid container justify={"center"} alignItems={"center"}>
          <Grid item xs={12} sm={6} md={3}>
            <img src={beach} className={classes.image} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography component={"div"}>
              <Box textAlign={"center"} mb={1} fontWeight={"fontWeightBold"}>
                Férias
              </Box>
              <Box>
                A diarista pode escolher receber no 12º mês o equivalente à
                média dos 11 meses anteriores de serviços prestados, previamente
                descontados, sem precisar trabalhar durante o 12º mês. O
                contratante receberá outro profissional em sua casa neste
                período sem custo adicional.
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography>
              <Box textAlign={"center"} mb={1} fontWeight={"fontWeightBold"}>
                Plano de Saúde
              </Box>
              <Box>
                Negociamos tarifas acessíveis com os provedores de planos de
                saúde. Até mesmo diaristas que trabalham apenas 1 vez por semana
                tem condição de contratar um plano.
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <img src={doctor} className={classes.image} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <img src={money} className={classes.image} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography>
              <Box textAlign={"center"} mb={1} fontWeight={"fontWeightBold"}>
                13º
              </Box>
              <Box>
                A diarista pode escolher receber no 12º mês trabalhado, o
                equivalente a média dos últimos onze meses trabalhados,
                previamente descontados.
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <RegisterButtons />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Mais;
