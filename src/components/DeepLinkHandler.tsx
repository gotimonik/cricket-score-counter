import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";
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

    // Normal pages
    const supportedPaths = [
      "/",
      "/create-game",
      "/join-game",
      "/match-history",
      "/tournaments",
      "/my-teams",
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

export default function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Don't register Capacitor listeners when running
    // as a normal website.
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let listener: { remove: () => Promise<void> } | null = null;

    const initialize = async () => {
      try {
        // App is already running / in background
        listener = await App.addListener("appUrlOpen", ({ url }) => {
          console.log("Deep link received:", url);

          const path = getAppPathFromUrl(url);

          if (path) {
            navigate(path);
          }
        });

        // App was completely closed and launched
        // using a deep link
        const launchUrl = await App.getLaunchUrl();

        if (launchUrl?.url) {
          console.log("App launched from deep link:", launchUrl.url);

          const path = getAppPathFromUrl(launchUrl.url);

          if (path) {
            navigate(path);
          }
        }
      } catch (error) {
        console.error("Failed to initialize deep link handler:", error);
      }
    };

    initialize();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [navigate]);

  return null;
}
