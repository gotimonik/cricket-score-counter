import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import Home from "./components/Home";
import "./css/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewCricketScorer from "./components/ViewCricketScorer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-game" element={<CricketScorer />} />
          <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
