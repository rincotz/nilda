import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import CalendarIcon from "@material-ui/icons/Event";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await props.procurarServicos(
        props.dia,
        props.disponibilidade
      );
      setServicos(result);
    };
    fetchData().then(() => setLoading(false));
  }, []);

  return loading ? (
    <CircularProgress />
  ) : (
    servicos.length > 0 && (
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
          {servicos.map((servico) => (
            <Box my={1} key={servico.sid}>
              <ServiceCard service={servico} />
              {console.log(servico)}
            </Box>
          ))}
        </Box>
      </Box>
    )
  );
};
