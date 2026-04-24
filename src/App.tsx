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
const loadSiteMapPage = () => import("./components/SiteMapPage");
const loadSupportPage = () => import("./components/SupportPage");
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
const SiteMapPage = lazy(loadSiteMapPage);
const SupportPage = lazy(loadSupportPage);
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
  loadSiteMapPage,
  loadSupportPage,
  loadNotFound,
];

export const preloadRouteModule = (pathname: string): Promise<unknown> => {
  if (pathname === "/") return loadHome();
  if (pathname === "/create-game") return loadCricketScorer();
  if (pathname === "/join-game") return loadJoinGame();
  if (pathname.startsWith("/join-game/")) return loadViewCricketScorer();
  if (pathname === "/match-history") return loadMatchHistoryPage();
  if (pathname.startsWith("/match-history/")) return loadViewSavedMatch();
  if (pathname === "/privacy-policy") return loadPrivacyPolicy();
  if (pathname === "/disclaimer") return loadDisclaimer();
  if (pathname === "/how-it-works") return loadHowItWorks();
  if (pathname === "/about") return loadAbout();
  if (pathname === "/download-app") return loadDownloadAppPage();
  if (pathname === "/app-preferences") return loadAppPreferencesPage();
  if (pathname === "/site-map") return loadSiteMapPage();
  if (pathname === "/support") return loadSupportPage();
  return loadNotFound();
};

const RouteLoadingFallback = () => {
  const [isAfterInitialMount, setIsAfterInitialMount] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(false);
  const shouldSuppressInitialFallback =
    typeof window !== "undefined" &&
    window.__APP_SUPPRESS_INITIAL_ROUTE_FALLBACK__ === true;

  React.useEffect(() => {
    setIsAfterInitialMount(true);
  }, []);

  React.useEffect(() => {
    if (shouldSuppressInitialFallback) {
      return;
    }
    if (!isAfterInitialMount) {
      return;
    }
    const timer = window.setTimeout(() => {
      setShowLogo(true);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [isAfterInitialMount, shouldSuppressInitialFallback]);

  if (shouldSuppressInitialFallback || !isAfterInitialMount || !showLogo) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <Box
        sx={{
          width: "clamp(88px, 20vw, 112px)",
          height: "clamp(88px, 20vw, 112px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "28px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 18px 48px rgba(8, 26, 56, 0.18)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "loaderPulse 0.95s ease-in-out infinite alternate",
            transformOrigin: "center",
          }}
        >
          <AppLogo size="72%" />
        </Box>
      </Box>
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
    if (typeof window !== "undefined") {
      window.__APP_SUPPRESS_INITIAL_ROUTE_FALLBACK__ = false;
    }
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
                <Route path="/site-map" element={<SiteMapPage />} />
                <Route path="/support" element={<SupportPage />} />
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
