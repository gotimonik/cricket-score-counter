import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type EventType = "refresh/tab-close" | "back-button" | "route-change";

const useNavigationEvents = (onLeavePage?: (event: EventType) => void) => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = "Are you sure you want to leave this page?";
      e.preventDefault();
      e.returnValue = message;

      onLeavePage?.("refresh/tab-close");
      return message;
    };

    const handlePopState = () => {
      const confirmLeave = window.confirm("Do you want to go back?");
      if (!confirmLeave) {
        // Push the current path again to prevent back navigation
        window.history.pushState(null, "", window.location.pathname);
      } else {
        onLeavePage?.("back-button");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Prevent default back navigation on first mount
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onLeavePage]);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      const confirmRouteChange = window.confirm(
        "Do you want to navigate to a different page?"
      );
      if (confirmRouteChange) {
        onLeavePage?.("route-change");
        previousPath.current = location.pathname;
      } else {
        // Block route change by going back to the previous path
        window.history.pushState(null, "", previousPath.current);
      }
    }
  }, [location.pathname, onLeavePage]);
};

export default useNavigationEvents;
