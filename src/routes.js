import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import Mais from "./pages/mais";
import ContratarForm from "./pages/contratar";
import HirerStep from "./HirerStep";

const testComponent = () => <HirerStep user={""} />;

export default () => (
  <BrowserRouter>
    <div>
      <Route path={"/"} component={Home} exact={true} />
      <Route path={"/mais"} component={Mais} />
      <Route path={"/contratar"} component={ContratarForm} />
      <Route path={"/trabalhar"} component={Mais} />
      <Route path={"/editar"} component={Mais} />
      <Route path={"/diarias"} component={Mais} />
      <Route path={"/beneficios"} component={Mais} />
      <Route path={"/ocorrencias"} component={Mais} />
      <Route path={"/test"} component={testComponent} />
    </div>
  </BrowserRouter>
);
