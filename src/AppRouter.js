import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import Mais from "./pages/mais";
import ContratarForm from "./pages/contratar";
import TrabalharForm from "./pages/trabalhar";
import WorkerCard from "./components/WorkerCard";
import { hirer, worker } from "./__tests__/people";
import DayCard from "./components/DayCard";
import FindWorkers from "./FindWorkers";
import ProfilePicStep from "./ProfilePicStep";

const testComponent = () => <FindWorkers user={hirer} />;

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path={"/"} component={Home} exact={true} />
      <Route path={"/mais"} component={Mais} />
      <Route path={"/contratar"} component={ContratarForm} />
      <Route path={"/trabalhar"} component={TrabalharForm} />
      <Route path={"/editar"} component={Mais} />
      <Route path={"/diarias"} component={Mais} />
      <Route path={"/beneficios"} component={Mais} />
      <Route path={"/ocorrencias"} component={Mais} />
      <Route path={"/test"} component={testComponent} />
    </Switch>
  </BrowserRouter>
);
