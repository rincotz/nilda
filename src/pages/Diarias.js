import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FormIntro from "../components/FormIntro";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "../components/Table";
import { pesquisaServicos } from "../actions/services";

const Diarias = (props) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await props.serviceQuery();
      setServices(result);
    };
    fetchData().then(() => setLoading(false));
  }, []);

  return (
    <Box>
      <FormIntro
        title={"Diárias"}
        text={"Aqui você pode gerenciar suas diárias."}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Table atividade={props.auth.atividade} services={services} />
        </Box>
      )}
    </Box>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = (dispatch) => ({
  serviceQuery: () => dispatch(pesquisaServicos()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diarias);
