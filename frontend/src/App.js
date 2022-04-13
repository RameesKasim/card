import { React } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import Router from "./routes/router";
import NavBar from "./components/navBar";
import "./App.scss";

function App() {
  let theme = createTheme({
    typography: {
      fontFamily: ["'Prompt'", " sans-serif"].join(","),
    },
    palette: {
      primary: { main: "#acb9be" },
      secondary: { main: "#ffff" },
    },
  });

  theme = createTheme(theme, {
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            color: "white",
            borderRadius: "80px",
            transition: "background .3s",
            whiteSpace: "nowrap",
            fontWeight: "600",
            letterSpacing: ".3px",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 25%), 0 2px 6px 0 rgb(0 0 0 / 15%)",
            "&:hover": {
              backgroundColor: "#acb9bed1",
            },
          },
          outlined: {
            borderRadius: "80px",
            transition: "background .3s",
            whiteSpace: "nowrap",
            fontWeight: "600",
            letterSpacing: ".3px",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 25%), 0 2px 6px 0 rgb(0 0 0 / 15%)",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Router />
    </ThemeProvider>
  );
}

export default App;
