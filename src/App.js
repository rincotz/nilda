import React from "react";
import {
  createMuiTheme,
  ThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppRouter from "./AppRouter";

function App() {
  const defaultTheme = useTheme();
  const myTheme = createMuiTheme({
    palette: {
      background: { default: defaultTheme.palette.background.paper },
    },
  });

  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <div>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
