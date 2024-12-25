import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    alternate: {
      main: "#000000",
      paper: "#121212",
    }
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default lightTheme;
