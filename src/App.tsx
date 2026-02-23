import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import Home from "./components/Home";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Disclaimer from "./components/Disclaimer";
import "./css/global.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ViewCricketScorer from "./components/ViewCricketScorer";
import JoinGame from "./components/JoinGame";
import NotFound from "./components/NotFound";
import ViewSavedMatch from "./components/ViewSavedMatch";
import { useGAClickTracking } from "./hooks/useGAClickTracking";
import { useGAPageTracking } from "./hooks/useGAPageTracking";
import MetaHelmet from "./components/MetaHelmet";
import Footer from "./components/Footer";

const App = () => {
  // Initialize Google Analytics page view tracking hook
  useGAPageTracking();
  // Initialize Google Analytics click tracking hook
  useGAClickTracking();

  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith('/create-game') || pathname.startsWith('/join-game');
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
          alignItems: "stretch",
          justifyContent: "flex-start",
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          position: "relative",
          minHeight: "100dvh",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            component="main"
            sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-game" element={<CricketScorer />} />
              <Route path="/join-game" element={<JoinGame />} />
              <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
              <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
              <Route path="/match-history/:historyId" element={<ViewSavedMatch />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          {/* Footer for compliance */}
          {!hideFooter && <Footer />}
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
