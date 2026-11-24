import type { NavigateFunction } from "react-router-dom";
import AuthService from "../services/AuthService";

export type JoinRole = "player" | "organizer";

/** Where each role lands after signing up or logging in. */
export const ROLE_DESTINATION: Record<JoinRole, string> = {
  player: "/me?welcome=player",
  organizer: "/tournaments",
};

/**
 * Sends someone to the right place for the role they picked: straight there
 * if they're logged in, otherwise to sign-up, which returns them there.
 */
export const startAs = (navigate: NavigateFunction, role: JoinRole, mode: "signup" | "login" = "signup") => {
  const destination = ROLE_DESTINATION[role];
  if (AuthService.isLoggedIn()) {
    navigate(destination);
    return;
  }
  navigate(mode === "signup" ? "/signup" : "/login", {
    state: { next_redirect: destination, join_role: role },
  });
};
