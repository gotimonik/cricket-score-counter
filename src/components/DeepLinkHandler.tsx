import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ALLOWED_HOSTS = new Set([
  "cricket-score-counter.com",
  "www.cricket-score-counter.com",
]);

const getAppPathFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);

    // Only accept our own website
    if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
      return null;
    }

    const pathname = parsedUrl.pathname;

    // /join-game/:gameId
    const joinGameMatch = pathname.match(/^\/join-game\/([^/]+)$/);

    if (joinGameMatch) {
      const gameId = decodeURIComponent(joinGameMatch[1]);

      return `/join-game/${encodeURIComponent(gameId)}`;
    }

    // /match-history/:historyId
    const historyMatch = pathname.match(/^\/match-history\/([^/]+)$/);

    if (historyMatch) {
      const historyId = decodeURIComponent(historyMatch[1]);

      return `/match-history/${encodeURIComponent(historyId)}`;
    }

    // /tournaments/:tournamentId
    const tournamentMatch = pathname.match(/^\/tournaments\/([^/]+)$/);

    if (tournamentMatch) {
      const tournamentId = decodeURIComponent(tournamentMatch[1]);

      return `/tournaments/${encodeURIComponent(tournamentId)}`;
    }

    // /u/:username (shared player profile)
    const shareMatch = pathname.match(/^\/u\/([^/]+)$/);

    if (shareMatch) {
      return `/u/${encodeURIComponent(decodeURIComponent(shareMatch[1]))}`;
    }

    // /t/:tournamentId (shared tournament page)
    const publicTournamentMatch = pathname.match(/^\/t\/([^/]+)$/);

    if (publicTournamentMatch) {
      return `/t/${encodeURIComponent(decodeURIComponent(publicTournamentMatch[1]))}`;
    }

    // /players/:playerId
    const playerMatch = pathname.match(/^\/players\/([^/]+)$/);

    if (playerMatch) {
      return `/players/${encodeURIComponent(decodeURIComponent(playerMatch[1]))}`;
    }

    // Normal pages
    const supportedPaths = [
      "/",
      "/create-game",
      "/join-game",
      "/match-history",
      "/tournaments",
      "/explore",
      "/explore/tournaments",
      "/explore/live",
      "/my-teams",
      "/me",
      "/login",
      "/signup",
      "/account",
    ];

    if (supportedPaths.includes(pathname)) {
      return pathname;
    }

    return null;
  } catch (error) {
    console.error("Invalid deep link:", error);
    return null;
  }
};

// getLaunchUrl() keeps returning the URL the app was launched with for the
// whole session, so it must only be acted on once. Kept at module level so a
// remount of the handler can't replay it either.
let launchUrlHandled = false;

export default function DeepLinkHandler() {
  const navigate = useNavigate();
  // With <BrowserRouter>, navigate gets a new identity on every pathname
  // change. Read it through a ref so the effect below runs once; depending on
  // [navigate] re-ran it after every navigation, replayed the launch URL and
  // looped (e.g. /signup -> "already logged in" redirect -> /signup ...).
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    // Don't register Capacitor listeners when running
    // as a normal website.
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let cancelled = false;
    let listener: { remove: () => Promise<void> } | null = null;

    const openUrl = (url: string) => {
      const path = getAppPathFromUrl(url);
      if (path) {
        navigateRef.current(path);
      }
    };

    const initialize = async () => {
      try {
        // App is already running / in background
        const handle = await App.addListener("appUrlOpen", ({ url }) => {
          console.log("Deep link received:", url);
          openUrl(url);
        });
        if (cancelled) {
          handle.remove();
          return;
        }
        listener = handle;

        // App was completely closed and launched using a deep link.
        // Only handle this once per app session.
        if (launchUrlHandled) {
          return;
        }
        launchUrlHandled = true;
        const launchUrl = await App.getLaunchUrl();

        if (!cancelled && launchUrl?.url) {
          console.log("App launched from deep link:", launchUrl.url);
          openUrl(launchUrl.url);
        }
      } catch (error) {
        console.error("Failed to initialize deep link handler:", error);
      }
    };

    initialize();

    return () => {
      cancelled = true;
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  return null;
}
