import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  aceitarServico,
  mostrarDiariasDisponiveis,
  procurarServicos,
  serviceQuery,
} from "../actions";
import FormIntro from "../components/FormIntro";
import WorkerDayCard from "../components/WorkerDayCard";
import Box from "@material-ui/core/Box";
import Table from "../components/Table";

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

  return (
    <Box>
      <FormIntro
        title={"Diárias"}
        text={
          "Aqui você pode checar se há trabalhos novos para os seus dias livres e gerenciar suas diárias" +
          ". Não se preocupe em pegar trabalhos novos, não deixamos que você marque dois trabalhos para o mesmo dia."
        }
      />
      <Box>{days().map((day) => day)}</Box>
      <Box>
        <Table
          atividade={props.user.atividade}
          serviceQuery={() => props.serviceQuery()}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  mostrarDiariasDisponiveis: () => dispatch(mostrarDiariasDisponiveis()),
  procurarServicos: (dia, disponibilidade) =>
    dispatch(procurarServicos(dia, disponibilidade)),
  aceitarServico: (servico) => dispatch(aceitarServico(servico)),
  serviceQuery: () => dispatch(serviceQuery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diarias);
