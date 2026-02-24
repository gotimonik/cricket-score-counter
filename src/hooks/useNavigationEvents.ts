// useNavigationEvents.ts
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type EventType =
  | "refresh/tab-close"
  | "back-button"
  | "route-change"
  | "page-hide";

interface UseNavigationEventsProps {
  onLeavePage: (event: EventType) => void;
  shouldPrompt: boolean;
  confirmationMessage?: string;
}

const useNavigationEvents = ({
  onLeavePage,
  shouldPrompt,
  confirmationMessage = "Are you sure you want to leave this page?",
}: UseNavigationEventsProps) => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const lastLeaveEventRef = useRef<{ type: EventType; ts: number } | null>(null);

  useEffect(() => {
    const emitLeave = (type: EventType) => {
      const now = Date.now();
      const last = lastLeaveEventRef.current;
      // Prevent duplicate leave events fired by multiple browser lifecycle events.
      if (last && last.type === type && now - last.ts < 400) {
        return;
      }
      lastLeaveEventRef.current = { type, ts: now };
      onLeavePage(type);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      emitLeave("refresh/tab-close");

      if (shouldPrompt) {
        e.preventDefault();
        e.returnValue = confirmationMessage;
      }
    };

    const handlePageHide = () => {
      emitLeave("page-hide");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        emitLeave("refresh/tab-close");
      }
    };

    const handlePopState = () => {
      if (shouldPrompt && !window.confirm(confirmationMessage)) {
        window.history.go(1);
        return;
      }
      emitLeave("back-button");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onLeavePage, shouldPrompt, confirmationMessage]);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;

    if (shouldPrompt && !window.confirm(confirmationMessage)) {
      // Keep the user on the previous route when they cancel navigation.
      window.history.pushState(null, "", previousPath.current);
      return;
    }

    onLeavePage("route-change");
    previousPath.current = location.pathname;
  }, [location.pathname, onLeavePage, shouldPrompt, confirmationMessage]);
};

export default useNavigationEvents;
