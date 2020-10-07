import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  subtitle: {
    marginTop: theme.spacing(2),
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

const NildaLogo = ({ subtitle = true }) => {
  const classes = useStyles();

  return (
    <Box>
      <Link to={"/"} className={classes.link}>
        <Typography align={"center"} variant={"h2"}>
          NILDA
        </Typography>
        <Divider variant={"middle"} />
        {subtitle && (
          <Typography
            className={classes.subtitle}
            variant={"subtitle1"}
            align={"center"}
          >
            aqui cuidamos de sua casa e de quem cuida dela
          </Typography>
        )}
      </Link>
    </Box>
  );
};

export default NildaLogo;
