import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";
import React, { Suspense, lazy } from "react";
import "./css/global.css";
import "./i18n"; // Initialize i18n
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useGAClickTracking } from "./hooks/useGAClickTracking";
import { useGAPageTracking } from "./hooks/useGAPageTracking";
import Footer from "./components/Footer";
import { applyAppPreferences, getStoredAppPreferences } from "./utils/appPreferences";
import AppLogo from "./components/AppLogo";

const loadHome = () => import("./components/Home");
const loadCricketScorer = () => import("./components/CricketScorer");
const loadJoinGame = () => import("./components/JoinGame");
const loadViewCricketScorer = () => import("./components/ViewCricketScorer");
const loadViewSavedMatch = () => import("./components/ViewSavedMatch");
const loadPrivacyPolicy = () => import("./components/PrivacyPolicy");
const loadDisclaimer = () => import("./components/Disclaimer");
const loadHowItWorks = () => import("./components/HowItWorks");
const loadAbout = () => import("./components/About");
const loadDownloadAppPage = () => import("./components/DownloadAppPage");
const loadAppPreferencesPage = () => import("./components/AppPreferencesPage");
const loadMatchHistoryPage = () => import("./components/MatchHistoryPage");
const loadNotFound = () => import("./components/NotFound");

const Home = lazy(loadHome);
const CricketScorer = lazy(loadCricketScorer);
const JoinGame = lazy(loadJoinGame);
const ViewCricketScorer = lazy(loadViewCricketScorer);
const ViewSavedMatch = lazy(loadViewSavedMatch);
const PrivacyPolicy = lazy(loadPrivacyPolicy);
const Disclaimer = lazy(loadDisclaimer);
const HowItWorks = lazy(loadHowItWorks);
const About = lazy(loadAbout);
const DownloadAppPage = lazy(loadDownloadAppPage);
const AppPreferencesPage = lazy(loadAppPreferencesPage);
const MatchHistoryPage = lazy(loadMatchHistoryPage);
const NotFound = lazy(loadNotFound);

const routePreloaders = [
  loadHome,
  loadCricketScorer,
  loadJoinGame,
  loadViewCricketScorer,
  loadViewSavedMatch,
  loadPrivacyPolicy,
  loadDisclaimer,
  loadHowItWorks,
  loadAbout,
  loadDownloadAppPage,
  loadAppPreferencesPage,
  loadMatchHistoryPage,
  loadNotFound,
];

const RouteLoadingFallback = () => {
  const [showLogo, setShowLogo] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLogo(true);
    }, 180);
    return () => window.clearTimeout(timer);
  }, []);

  if (!showLogo) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
      }}
    >
      <AppLogo size="clamp(88px, 20vw, 112px)" />
    </Box>
  );
};

const App = () => {
  // Initialize Google Analytics page view tracking hook
  useGAPageTracking();
  // Initialize Google Analytics click tracking hook
  useGAClickTracking();
  React.useEffect(() => {
    applyAppPreferences(getStoredAppPreferences());
  }, []);
  React.useEffect(() => {
    let cancelled = false;
    const browserWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
    const preloadRoutes = () => {
      if (cancelled) return;
      routePreloaders.forEach((loadRoute) => {
        void loadRoute();
      });
    };

    if (typeof window === "undefined") {
      return undefined;
    }

    if (typeof browserWindow.requestIdleCallback === "function") {
      const idleId = browserWindow.requestIdleCallback(preloadRoutes, { timeout: 1500 });
      return () => {
        cancelled = true;
        browserWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(preloadRoutes, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const { pathname } = useLocation();
  const hideFooter =
    pathname.startsWith("/create-game") ||
    pathname.startsWith("/join-game");
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
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-game" element={<CricketScorer />} />
                <Route path="/join-game" element={<JoinGame />} />
                <Route path="/match-history" element={<MatchHistoryPage />} />
                <Route path="/join-game/:gameId" element={<ViewCricketScorer />} />
                <Route path="/match-history/:historyId" element={<ViewSavedMatch />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/download-app" element={<DownloadAppPage />} />
                <Route path="/app-preferences" element={<AppPreferencesPage />} />
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
