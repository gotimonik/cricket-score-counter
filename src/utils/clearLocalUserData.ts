/**
 * Wipes everything this app has stored on the device about the user and
 * their matches: auth tokens, saved/local matches, teams and players, the
 * in-progress match, tournament setup, cached live views and the last joined
 * game ID. Every one of those keys starts with "cricket" (see the *_KEY
 * constants across src/), so we match on that prefix rather than keeping a
 * list that silently goes stale when a new key is added.
 *
 * Deliberately kept: purely cosmetic, non-personal settings such as
 * "app-preferences" (theme, text size) and "seen this tip" flags.
 */
export const clearLocalUserData = (): void => {
  if (typeof window === "undefined") return;

  const wipe = (storage: Storage | undefined) => {
    if (!storage) return;
    try {
      const keys: string[] = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key && key.toLowerCase().startsWith("cricket")) keys.push(key);
      }
      keys.forEach((key) => storage.removeItem(key));
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  };

  wipe(window.localStorage);
  wipe(window.sessionStorage);
};

export default clearLocalUserData;
