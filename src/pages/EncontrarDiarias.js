import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FormIntro from "../components/FormIntro";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { aceitarServico, pesquisaDiarias } from "../actions/services";
import CartaoAgrupaContratantes from "../components/CartaoAgrupaContratantes";

const EcontrarDiarias = (props) => {
  const [diarias, setDiarias] = useState({});
  const [loading, setLoading] = useState(true);
  const [blockButtons, setBlockButtons] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDiarias({});
    const promises = [];
    for (const [key, value] of Object.entries(props.user.diasLivres)) {
      value > 0 && promises.push(props.procurarServicos(key, value));
    }
    const auxObj = { ...diarias };
    Promise.all(promises).then((arrays) => {
      const filteredArray = arrays.filter((array) => array.length > 0);
      filteredArray.forEach((array) => {
        auxObj[array[0].diaAgendado] = array;
        setDiarias(auxObj);
      });
      setLoading(false);
      setBlockButtons(false);
    });
  }, [props.user.uid, reload]);

  const days = () => {
    const elements = [];
    Object.keys(diarias).forEach((key) => {
      elements.push(
        <CartaoAgrupaContratantes
          dia={key}
          servicos={diarias[key]}
          blockButtons={blockButtons}
          setBlockButtons={() => setBlockButtons(true)}
          setReload={() => setReload(!reload)}
          {...props}
        />
      );
    });
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
      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          {days().map((day) => day)}
        </Box>
      )}
    </Box>
  );
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  procurarServicos: (dia) => dispatch(pesquisaDiarias(dia)),
  aceitarServico: (servico) => dispatch(aceitarServico(servico)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EcontrarDiarias);
