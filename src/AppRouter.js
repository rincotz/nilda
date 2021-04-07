import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/home";
import Mais from "./pages/mais";
import ContratarForm from "./pages/contratar";
import TrabalharForm from "./pages/trabalhar";
import Diarias from "./pages/diarias";
import NovaDiaria from "./pages/novaDiaria";
import contratacoes from "./pages/contratacoes";
import Navbar from "./components/Navbar";
import Ocorrencias from "./pages/ocorrencias";
import Editar from "./pages/editar";

const testComponent = () => <Diarias />;

export default () => (
  <BrowserRouter>
    <Route path={"/"} component={Navbar} />
    <Route path={"/"} component={Home} exact={true} />
    <Route path={"/mais"} component={Mais} />
    <Route path={"/contratar"} component={ContratarForm} />
    <Route path={"/trabalhar"} component={TrabalharForm} />
    <Route path={"/editar"} component={Editar} />
    <Route path={"/diarias"} component={Diarias} />
    <Route path={"/contratacoes"} component={contratacoes} />
    <Route path={"/beneficios"} component={Mais} />
    <Route path={"/ocorrencias"} component={Ocorrencias} />
    <Route path={"/novaDiaria"} component={NovaDiaria} />
    <Route path={"/test"} component={testComponent} />
  </BrowserRouter>
);
