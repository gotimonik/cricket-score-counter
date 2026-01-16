import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import Home from "./components/Home";
import "./css/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewCricketScorer from "./components/ViewCricketScorer";
import NotFound from "./components/NotFound";
import { useGAClickTracking } from "./hooks/useGAClickTracking";
import { useGAPageTracking } from "./hooks/useGAPageTracking";
import MetaHelmet from "./components/MetaHelmet";

const App = () => {
  // Initialize Google Analytics page view tracking hook
  useGAPageTracking();
  // Initialize Google Analytics click tracking hook
  useGAClickTracking();

  return (
    <>
      <MetaHelmet
        pageTitle="Home"
        canonical="/"
        description="Cricket Score Counter - Track your cricket match easily, create and join live games, and share scores. The best free cricket scoring app."
      />
      <Box
        sx={{
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-game" element={<CricketScorer />} />
            <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </Box>
    </>
  );
};

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWithRouter;
