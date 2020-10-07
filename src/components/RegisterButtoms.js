import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import CleaningIcon from "@material-ui/icons/Face";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  box: {
    marginTop: theme.spacing(3),
  },
}));

const RegisterButtoms = () => {
  const classes = useStyles();

  return (
    <Box
      className={classes.box}
      display={"flex"}
      flexWrap={"wrap"}
      justifyContent={"space-evenly"}
    >
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
        startIcon={<CleaningIcon />}
      >
        Trabalhar
      </Button>
    </Box>
  );
};

export default RegisterButtoms;
