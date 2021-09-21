import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/home";
import Mais from "./pages/mais";
import SignInForm from "./pages/SignInForm";
import Diarias from "./pages/Diarias";
import EncontrarDiarias from "./pages/EncontrarDiarias";
import NovaDiaria from "./pages/NovaDiaria";
import contratacoes from "./pages/contratacoes";
import Navbar from "./components/Navbar";
import Ocorrencias from "./pages/ocorrencias";
import Editar from "./pages/editar";
import Foto from "./formSteps/Foto";

const testComponent = () => <Foto user={{ meioDeContatoPreferido: "sms" }} />;

export default () => (
  <BrowserRouter>
    <Route path={"/"} component={Navbar} />
    <Route path={"/"} component={Home} exact={true} />
    <Route path={"/mais"} component={Mais} />
    <Route path={"/contratar"} component={SignInForm} />
    <Route path={"/trabalhar"} component={SignInForm} />
    <Route path={"/editar"} component={Editar} />
    <Route path={"/diarias"} component={Diarias} />
    <Route path={"/encontrarDiarias"} component={EncontrarDiarias} />
    <Route path={"/contratacoes"} component={contratacoes} />
    <Route path={"/beneficios"} component={Mais} />
    <Route path={"/ocorrencias"} component={Ocorrencias} />
    <Route path={"/novaDiaria"} component={NovaDiaria} />
    <Route path={"/test"} component={testComponent} />
  </BrowserRouter>
);
