// Shared "scoreboard" backgrounds for every card that shows scores or player
// statistics (live scoreboard, scorecards, partnerships, profile and
// tournament stats). Built from the theme's accent colours, so they follow
// whichever colour theme the user picked in App Preferences. Light surfaces
// keep the existing dark text readable; only the background changes.

const S = "var(--app-accent-start, #43cea2)";
const E = "var(--app-accent-end, #185a9d)";

/** Thin gold rule across the top, like the trim on a pavilion board. */
const goldHairline =
  "linear-gradient(90deg, rgba(217,180,90,0) 0%, rgba(217,180,90,0.8) 50%, rgba(217,180,90,0) 100%) top center / 72% 2px no-repeat";

/** Faint diagonal stripes, like a freshly mown outfield. */
const outfieldStripes = "repeating-linear-gradient(100deg, rgba(12,53,88,0.028) 0 22px, rgba(12,53,88,0) 22px 44px)";
const outfieldStripesOnDark = "repeating-linear-gradient(100deg, rgba(255,255,255,0.045) 0 22px, rgba(255,255,255,0) 22px 44px)";

/** Large cards: scoreboard, scorecard, profile and tournament sections. */
export const statCardBackground = [
  goldHairline,
  `radial-gradient(110% 85% at 100% 0%, color-mix(in srgb, ${S} 20%, transparent 80%) 0%, transparent 62%)`,
  "radial-gradient(90% 70% at 0% 100%, rgba(217,180,90,0.16) 0%, rgba(217,180,90,0) 62%)",
  outfieldStripes,
  `linear-gradient(165deg, #ffffff 0%, color-mix(in srgb, ${S} 6%, #ffffff 94%) 55%, color-mix(in srgb, ${E} 9%, #ffffff 91%) 100%)`,
].join(", ");

/** A tinted panel inside a card (e.g. the innings summary block). */
export const statPanelBackground = [
  `radial-gradient(100% 90% at 100% 0%, color-mix(in srgb, ${S} 22%, transparent 78%) 0%, transparent 65%)`,
  outfieldStripes,
  `linear-gradient(135deg, color-mix(in srgb, ${S} 11%, #ffffff 89%) 0%, color-mix(in srgb, ${E} 8%, #ffffff 92%) 100%)`,
].join(", ");

/** Small stat tiles (Score, Overs, Top batter, Runs, Average...). */
export const statTileBackground = [
  `radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, ${S} 16%, transparent 84%) 0%, transparent 70%)`,
  "radial-gradient(80% 80% at 100% 100%, rgba(217,180,90,0.14) 0%, rgba(217,180,90,0) 70%)",
  `linear-gradient(150deg, rgba(255,255,255,0.96) 0%, color-mix(in srgb, ${E} 7%, #ffffff 93%) 100%)`,
].join(", ");

/** Highlighted (dark board-green) tiles. */
export const statBoardBackground = [
  "radial-gradient(90% 90% at 100% 0%, rgba(241,214,138,0.2) 0%, rgba(241,214,138,0) 60%)",
  outfieldStripesOnDark,
  "linear-gradient(160deg, #1a4638 0%, #0F2E25 60%, #0A1F1A 100%)",
].join(", ");

/**
 * Layers to put over an existing dark scoreboard header: a gold floodlight
 * glow, a seam-red glow and outfield stripes. Append the header's own
 * gradient after these.
 */
export const scoreHeaderOverlay = [
  "radial-gradient(80% 130% at 100% 0%, rgba(241,214,138,0.24) 0%, rgba(241,214,138,0) 60%)",
  "radial-gradient(70% 130% at 0% 100%, rgba(181,56,43,0.22) 0%, rgba(181,56,43,0) 60%)",
  outfieldStripesOnDark,
].join(", ");

/** Translucent strip inside a card, so the card background shows through. */
export const statStripBackground = `linear-gradient(90deg, color-mix(in srgb, ${S} 9%, transparent 91%) 0%, color-mix(in srgb, ${E} 6%, transparent 94%) 100%)`;
