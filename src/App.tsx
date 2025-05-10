import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import "./css/global.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CricketScorer />
    </ThemeProvider>
  );
}

export default App;
