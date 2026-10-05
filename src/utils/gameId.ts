/** localStorage key for the last game a viewer joined (used by "Reload game"). */
export const LAST_JOINED_GAME_ID_KEY = "cricket-last-joined-game-id";

/**
 * Game IDs are generated in upper case (e.g. "K7Q2XZ"), so normalise what
 * people type or share: upper-case it and drop spaces.
 */
export const normalizeGameId = (value: string): string =>
  value.replace(/\s+/g, "").toUpperCase();
