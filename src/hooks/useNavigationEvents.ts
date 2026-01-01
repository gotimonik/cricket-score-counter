// useNavigationEvents.ts
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type EventType = "refresh/tab-close" | "back-button" | "route-change";

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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      onLeavePage("refresh/tab-close");

      if (shouldPrompt) {
        e.preventDefault();
        e.returnValue = confirmationMessage;
      }
    };

    const handlePopState = () => {
      onLeavePage("back-button");

      if (shouldPrompt && !window.confirm(confirmationMessage)) {
        window.history.forward(); // cancels back navigation
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onLeavePage, shouldPrompt, confirmationMessage]);

  useEffect(() => {
    console.log('previousPath.current, location.pathname', previousPath.current, location.pathname)
    if (previousPath.current !== location.pathname) {
      onLeavePage("route-change");

      if (shouldPrompt && !window.confirm(confirmationMessage)) {
        // Redirect back to previous path and restore router state
        window.history.pushState(null, "", previousPath.current);
        // Try to trigger a navigation event to restore state
        const event = new PopStateEvent("popstate");
        window.dispatchEvent(event);
      } else {
        previousPath.current = location.pathname;
      }
    }
  }, [location.pathname, onLeavePage, shouldPrompt, confirmationMessage]);
};

export default useNavigationEvents;
