import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import "./css/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CricketScorer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
