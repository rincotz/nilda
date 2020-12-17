import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { mostrarDiariasDisponiveis, procurarServicos } from "../actions";
import WorkerDayCard from "../components/WorkerDayCard";
import Box from "@material-ui/core/Box";

const Diarias = (props) => {
  const [diarias, setDiarias] = useState({});
  useEffect(() => {
    props.user.uid &&
      props
        .mostrarDiariasDisponiveis()
        .then((diariasDisp) => setDiarias(diariasDisp));
  }, [props.user.uid]);

  const days = () => {
    const elements = [];
    for (const [key, value] of Object.entries(diarias)) {
      elements.push(
        <WorkerDayCard key={key} dia={key} disponibilidade={value} {...props} />
      );
    }
    return elements;
  };

  return <Box>{days().map((day) => day)}</Box>;
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  mostrarDiariasDisponiveis: () => dispatch(mostrarDiariasDisponiveis()),
  procurarServicos: (dia, disponibilidade) =>
    dispatch(procurarServicos(dia, disponibilidade)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diarias);
