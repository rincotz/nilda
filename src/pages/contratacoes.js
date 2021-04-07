import React from "react";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import Table from "../components/Table";
import FormIntro from "../components/FormIntro";
import { serviceQuery } from "../actions";

export const Contratacoes = ({ user, serviceQuery }) => (
  <Box bgcolor={"background.paper"}>
    <FormIntro
      title={"Contratações"}
      text={"Suas contratações aparecerão aqui"}
    />
    <Table atividade={user.atividade} serviceQuery={() => serviceQuery()} />
  </Box>
);

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = (dispatch) => ({
  serviceQuery: () => dispatch(serviceQuery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contratacoes);
