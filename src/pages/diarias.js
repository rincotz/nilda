import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { serviceQuery } from "../actions";
import FormIntro from "../components/FormIntro";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "../components/Table";

const Diarias = (props) => {
  const [hirers, setHirers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await props.serviceQuery();
      setHirers(result);
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
          <Table atividade={props.user.atividade} users={hirers} />
        </Box>
      )}
    </Box>
  );
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  serviceQuery: () => dispatch(serviceQuery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diarias);
