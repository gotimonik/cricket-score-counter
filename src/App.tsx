import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { theme } from "./theme";
import React, { Suspense, lazy } from "react";
import "./css/global.css";
import "./i18n"; // Initialize i18n
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useGAClickTracking } from "./hooks/useGAClickTracking";
import { useGAPageTracking } from "./hooks/useGAPageTracking";
import Footer from "./components/Footer";
import {
  applyAppPreferences,
  getStoredAppPreferences,
} from "./utils/appPreferences";
import AppLogo from "./components/AppLogo";
import ScrollToTop from "./components/ScrollToTop";
import AdBannerController from "./components/AdBannerController";

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
const loadTournamentManager = () => import("./components/TournamentManager");
const loadSiteMapPage = () => import("./components/SiteMapPage");
const loadSupportPage = () => import("./components/SupportPage");
const loadCricketScoringGuide = () =>
  import("./components/CricketScoringGuide");
const loadFaqPage = () => import("./components/FaqPage");
const loadContactPage = () => import("./components/ContactPage");
const loadTermsOfUse = () => import("./components/TermsOfUse");
const loadScorekeepingTips = () => import("./components/ScorekeepingTips");
const loadCricketRulesGuide = () => import("./components/CricketRulesGuide");
const loadCricketMatchFormats = () => import("./components/CricketMatchFormats");
const loadCricketStatisticsGuide = () => import("./components/CricketStatisticsGuide");
const loadCricketResources = () => import("./components/CricketResources");
const loadNotFound = () => import("./components/NotFound");
const loadAuthPages = () => import("./components/AuthPages");

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
const TournamentManager = lazy(loadTournamentManager);
const SiteMapPage = lazy(loadSiteMapPage);
const SupportPage = lazy(loadSupportPage);
const CricketScoringGuide = lazy(loadCricketScoringGuide);
const FaqPage = lazy(loadFaqPage);
const ContactPage = lazy(loadContactPage);
const TermsOfUse = lazy(loadTermsOfUse);
const ScorekeepingTips = lazy(loadScorekeepingTips);
const CricketRulesGuide = lazy(loadCricketRulesGuide);
const CricketMatchFormats = lazy(loadCricketMatchFormats);
const CricketStatisticsGuide = lazy(loadCricketStatisticsGuide);
const CricketResources = lazy(loadCricketResources);
const NotFound = lazy(loadNotFound);
const LoginPage = lazy(() =>
  loadAuthPages().then((module) => ({ default: module.LoginPage })),
);
const SignupPage = lazy(() =>
  loadAuthPages().then((module) => ({ default: module.SignupPage })),
);
const ResetPasswordPage = lazy(() =>
  loadAuthPages().then((module) => ({ default: module.ResetPasswordPage })),
);

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
  loadTournamentManager,
  loadSiteMapPage,
  loadSupportPage,
  loadCricketScoringGuide,
  loadFaqPage,
  loadContactPage,
  loadTermsOfUse,
  loadScorekeepingTips,
  loadCricketRulesGuide,
  loadCricketMatchFormats,
  loadCricketStatisticsGuide,
  loadCricketResources,
  loadNotFound,
  loadAuthPages,
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
  if (pathname === "/tournaments") return loadTournamentManager();
  if (pathname === "/site-map") return loadSiteMapPage();
  if (pathname === "/support") return loadSupportPage();
  if (pathname === "/cricket-scoring-guide") return loadCricketScoringGuide();
  if (pathname === "/faq") return loadFaqPage();
  if (pathname === "/contact") return loadContactPage();
  if (pathname === "/terms") return loadTermsOfUse();
  if (pathname === "/scorekeeping-tips") return loadScorekeepingTips();
  if (pathname === "/cricket-rules-guide") return loadCricketRulesGuide();
  if (pathname === "/cricket-match-formats") return loadCricketMatchFormats();
  if (pathname === "/cricket-statistics-guide") return loadCricketStatisticsGuide();
  if (pathname === "/cricket-resources") return loadCricketResources();
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password"
  ) {
    return loadAuthPages();
  }
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
  const navigate = useNavigate();
  const location = useLocation();
  // Initialize Google Analytics page view tracking hook
  useGAPageTracking();
  // Initialize Google Analytics click tracking hook
  useGAClickTracking();

  if (Capacitor.getPlatform() === "ios") {
    document.documentElement.classList.add("ios");
  }

  const isPrerenderUserAgent =
    typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";
  React.useEffect(() => {
    applyAppPreferences(getStoredAppPreferences());
  }, []);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.__APP_SUPPRESS_INITIAL_ROUTE_FALLBACK__ = false;
    }
  }, []);
  React.useEffect(() => {
    const preventDefault = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("selectstart", preventDefault);
    document.addEventListener("dblclick", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("dblclick", preventDefault);
    };
  }, []);
  React.useEffect(() => {
    if (isPrerenderUserAgent) {
      return undefined;
    }

    let cancelled = false;
    const browserWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
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
      const idleId = browserWindow.requestIdleCallback(preloadRoutes, {
        timeout: 1500,
      });
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
  }, [isPrerenderUserAgent]);

  const { pathname } = location;
  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    let listener:
      | {
          remove: () => Promise<void>;
        }
      | undefined;
    let isActive = true;

    void CapacitorApp.addListener("backButton", () => {
      const currentPath = window.location.pathname || "/";

      if (currentPath === "/") {
        void CapacitorApp.exitApp();
        return;
      }

      if (window.history.length > 1) {
        navigate(-1);
        return;
      }

      navigate("/", { replace: true });
    }).then((handle) => {
      if (!isActive) {
        void handle.remove();
        return;
      }
      listener = handle;
    });

    return () => {
      isActive = false;
      void listener?.remove();
    };
  }, [navigate]);

  const hideFooter =
    pathname.startsWith("/create-game") ||
    pathname.startsWith("/join-game") ||
    pathname.startsWith("/tournaments");
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
        <AdBannerController />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SpeedInsights />
            <ScrollToTop />
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-game" element={<CricketScorer />} />
                <Route path="/join-game" element={<JoinGame />} />
                <Route path="/match-history" element={<MatchHistoryPage />} />
                <Route
                  path="/join-game/:gameId"
                  element={<ViewCricketScorer />}
                />
                <Route
                  path="/match-history/:historyId"
                  element={<ViewSavedMatch />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/download-app" element={<DownloadAppPage />} />
                <Route
                  path="/app-preferences"
                  element={<AppPreferencesPage />}
                />
                <Route path="/tournaments" element={<TournamentManager />} />
                <Route path="/site-map" element={<SiteMapPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route
                  path="/cricket-scoring-guide"
                  element={<CricketScoringGuide />}
                />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route
                  path="/scorekeeping-tips"
                  element={<ScorekeepingTips />}
                />
                <Route path="/cricket-rules-guide" element={<CricketRulesGuide />} />
                <Route path="/cricket-match-formats" element={<CricketMatchFormats />} />
                <Route path="/cricket-statistics-guide" element={<CricketStatisticsGuide />} />
                <Route path="/cricket-resources" element={<CricketResources />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
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
