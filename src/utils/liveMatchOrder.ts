/**
 * Merges a fresh live-matches response into the list already on screen
 * without moving any card: matches already shown keep their place (with
 * their new score), finished ones drop out, and matches that just went live
 * go on top in the order the server sent them (newest first).
 */
export const keepLiveMatchOrder = <T extends { code: string }>(prev: readonly T[] | null | undefined, next: readonly T[]): T[] => {
  if (!prev || prev.length === 0) return [...next];
  const byCode = new Map(next.map((m) => [m.code, m]));
  const shown = new Set(prev.map((m) => m.code));
  const added = next.filter((m) => !shown.has(m.code));
  const kept = prev.flatMap((m) => {
    const fresh = byCode.get(m.code);
    return fresh ? [fresh] : [];
  });
  return [...added, ...kept];
};

export default keepLiveMatchOrder;
