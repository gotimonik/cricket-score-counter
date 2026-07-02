// A small palette of on-brand gradient pairs used as a fallback team avatar
// background when no custom logo has been set. Picking a gradient
// deterministically from the team's id/name keeps the same team visually
// consistent across renders while giving different teams distinct colors.
const TEAM_AVATAR_GRADIENTS: Array<[string, string]> = [
  ["#43cea2", "#185a9d"], // teal -> blue (brand default)
  ["#8e54e9", "#4776e6"], // violet -> blue
  ["#16a085", "#2c3e50"], // green -> slate
  ["#2193b0", "#6dd5ed"], // blue -> cyan
  ["#f2709c", "#ff9472"], // rose -> peach
  ["#654ea3", "#eaafc8"], // indigo -> magenta
];

const hashSeed = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getTeamAvatarGradient = (seed: string): string => {
  const [start, end] =
    TEAM_AVATAR_GRADIENTS[hashSeed(seed || "team") % TEAM_AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
};
