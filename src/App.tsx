import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import Home from "./components/Home";
import "./css/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewCricketScorer from "./components/ViewCricketScorer";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
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
    </Box>
  );
}

export default App;
