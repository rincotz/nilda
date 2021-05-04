import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "../components/Table";
import FormIntro from "../components/FormIntro";
import { serviceQuery } from "../actions";

export const Contratacoes = ({ user, serviceQuery }) => {
  const [diaristas, setDiaristas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await serviceQuery();
      setDiaristas(result);
    };
    fetchData().then(() => setLoading(false));
  }, []);

  return (
    <Box bgcolor={"background.paper"}>
      <FormIntro
        title={"Contratações"}
        text={"Suas contratações aparecerão aqui"}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Table atividade={user.atividade} users={diaristas} />
      )}
    </Box>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = (dispatch) => ({
  serviceQuery: () => dispatch(serviceQuery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contratacoes);
