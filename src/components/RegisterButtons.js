import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import SvgIcon from "@material-ui/core/SvgIcon";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  box: {
    marginTop: theme.spacing(3),
  },
}));

const RegisterButtons = ({ logged }) => {
  const classes = useStyles();

  const mainButton = (whosLogged) => {
    switch (whosLogged) {
      case false:
        return (
          <Fragment>
            <Button
              component={Link}
              to={"/contratar"}
              color={"primary"}
              size={"large"}
              variant={"contained"}
              startIcon={<HomeIcon />}
            >
              Contratar
            </Button>
            <Button
              component={Link}
              to={"/trabalhar"}
              color={"secondary"}
              size={"large"}
              variant={"contained"}
              startIcon={
                <SvgIcon>
                  <path
                    d={
                      "M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"
                    }
                  />
                </SvgIcon>
              }
            >
              Trabalhar
            </Button>
          </Fragment>
        );
      case "contratante":
        return (
          <Button
            component={Link}
            to={"/novaDiaria"}
            color={"primary"}
            size={"large"}
            variant={"contained"}
            startIcon={
              <SvgIcon>
                <path
                  d={
                    "M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"
                  }
                />
              </SvgIcon>
            }
          >
            Nova Diária
          </Button>
        );
      case "diarista":
        return (
          <Button
            component={Link}
            to={"/trabalhar"}
            color={"primary"}
            size={"large"}
            variant={"contained"}
            startIcon={<HomeIcon />}
          >
            Encontrar Diárias
          </Button>
        );
    }
  };

  return (
    <Box
      className={classes.box}
      display={"flex"}
      flexWrap={"wrap"}
      justifyContent={"space-evenly"}
    >
      {mainButton(logged)}
    </Box>
  );
};

export default RegisterButtons;
