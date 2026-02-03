import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";
import CricketScorer from "./components/CricketScorer";
import Home from "./components/Home";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Disclaimer from "./components/Disclaimer";
import "./css/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewCricketScorer from "./components/ViewCricketScorer";
import NotFound from "./components/NotFound";
import { useGAClickTracking } from "./hooks/useGAClickTracking";
import { useGAPageTracking } from "./hooks/useGAPageTracking";
import MetaHelmet from "./components/MetaHelmet";
import Footer from "./components/Footer";

const App = () => {
  // Initialize Google Analytics page view tracking hook
  useGAPageTracking();
  // Initialize Google Analytics click tracking hook
  useGAClickTracking();

  const { pathname } = window.location;
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
          alignItems: "center",
          justifyContent: "flex-start",
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          position: "relative",
          minHeight: "100vh",
          overflowX: "hidden",
          pb: 18, // space for sticky footer
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-game" element={<CricketScorer />} />
            <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
        {/* Footer for compliance */}
        {!hideFooter && <Footer />}
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
