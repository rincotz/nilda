import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Routes from "./routes";
import Home from "./pages/home";

const theme = createMuiTheme();

const routes = (
  <Router>
    <Route path={"/"} component={Home}></Route>
  </Router>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
