import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppRouter from "./AppRouter";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
