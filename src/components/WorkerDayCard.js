import React from "react";
import Box from "@material-ui/core/Box";
import CalendarIcon from "@material-ui/icons/Event";
import ServiceCard from "./ServiceCard";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  dayCard: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "80%",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "50%",
    },
  },
}));

export default (props) => {
  const classes = useStyles();

  return (
    props.servicos.length > 0 && (
      <Box
        className={classes.dayCard}
        boxShadow={3}
        mx={"auto"}
        my={2}
        p={2}
        display={"flex"}
        flexDirection={"column"}
      >
        <Box fontSize={"h5.fontSize"} mb={2}>
          <CalendarIcon style={{ verticalAlign: "middle" }} /> {props.dia}
        </Box>
        <Box mx={"auto"}>
          {props.servicos.map((servico) => (
            <Box my={1} key={servico.sid}>
              <ServiceCard
                service={servico}
                aceitarServico={(service) => {
                  props.aceitarServico(service);
                  props.setReload();
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    )
  );
};
