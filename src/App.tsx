import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { theme } from "./theme";
import React, { Suspense, lazy } from "react";
import "./css/global.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useGAClickTracking } from "./hooks/useGAClickTracking";
import { useGAPageTracking } from "./hooks/useGAPageTracking";
import Footer from "./components/Footer";
import { applyAppPreferences, getStoredAppPreferences } from "./utils/appPreferences";

const Home = lazy(() => import("./components/Home"));
const CricketScorer = lazy(() => import("./components/CricketScorer"));
const JoinGame = lazy(() => import("./components/JoinGame"));
const ViewCricketScorer = lazy(() => import("./components/ViewCricketScorer"));
const ViewSavedMatch = lazy(() => import("./components/ViewSavedMatch"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const Disclaimer = lazy(() => import("./components/Disclaimer"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  // Initialize Google Analytics page view tracking hook
  useGAPageTracking();
  // Initialize Google Analytics click tracking hook
  useGAClickTracking();
  React.useEffect(() => {
    applyAppPreferences(getStoredAppPreferences());
  }, []);

  const { pathname } = useLocation();
  const hideFooter =
    pathname.startsWith("/create-game") ||
    pathname.startsWith("/join-game") ||
    pathname.startsWith("/v1/create-game") ||
    pathname.startsWith("/v1/join-game");
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
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
            <Suspense
              fallback={
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "40vh",
                  }}
                >
                  <CircularProgress color="inherit" />
                </Box>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-game" element={<CricketScorer />} />
                <Route path="/join-game" element={<JoinGame />} />
                <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
                <Route path="/match-history/:historyId" element={<ViewSavedMatch />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/v1" element={<Home />} />
                <Route path="/v1/" element={<Home />} />
                <Route path="/v1/create-game" element={<CricketScorer />} />
                <Route path="/v1/join-game" element={<JoinGame />} />
                <Route path="/v1/join-game/:gameId" element={<ViewCricketScorer />} />
                <Route path="/v1/match-history/:historyId" element={<ViewSavedMatch />} />
                <Route path="/v1/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/v1/disclaimer" element={<Disclaimer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
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
