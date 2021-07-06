import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FormIntro from "../components/FormIntro";
import WorkerDayCard from "../components/WorkerDayCard";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  aceitarServico,
  mostrarDiariasDisponiveis,
  procurarServicos,
} from "../actions/users";

const EcontrarDiarias = (props) => {
  const [diarias, setDiarias] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    props.user.uid &&
      props.mostrarDiariasDisponiveis().then((diariasDisp) => {
        const promises = [];
        for (const [key, value] of Object.entries(diariasDisp)) {
          promises.push(props.procurarServicos(key, value));
        }
        const auxObj = { ...diarias };
        Promise.all(promises).then((arrays) => {
          const filteredArray = arrays.filter((array) => array.length > 0);
          filteredArray.forEach((array) => {
            auxObj[array[0].diaAgendado] = array;
            setDiarias({ ...diarias, ...auxObj });
          });
          setLoading(false);
        });
      });
  }, [props.user.uid, reload]);

  const days = () => {
    const elements = [];
    for (const [key, value] of Object.entries(diarias)) {
      elements.push(
        <WorkerDayCard
          key={key}
          dia={key}
          servicos={diarias[key]}
          setReload={() => setReload(!reload)}
          {...props}
        />
      );
    }
    return elements;
  };

  return (
    <Box>
      <FormIntro
        title={"Diárias"}
        text={
          "Aqui você pode checar se há trabalhos novos para os seus dias livres. Não se preocupe" +
          " em pegar trabalhos novos, não deixamos que você marque dois trabalhos para o mesmo dia."
        }
      />
      {loading ? <CircularProgress /> : <Box>{days().map((day) => day)}</Box>}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EcontrarDiarias);
