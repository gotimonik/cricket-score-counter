// Story-sized (1080 x 1920) share images in the app's "Pavilion" look, drawn
// on a canvas so they work offline and on every platform. Shared together
// with the link, they show up nicely as an Instagram / WhatsApp story or post.

export type CardStat = { label: string; value: string };

const W = 1080;
const H = 1920;
const GREEN = "#0F2E25";
const GOLD = "#D9B45A";
const GOLD_LIGHT = "#F1D68A";
const WHITE = "#FFFFFF";
const SOFT = "rgba(255,255,255,0.72)";
const FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const LOGO_SRC = "/images/new_logo.png";

const loadImage = (src: string, crossOrigin = false): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const font = (size: number, weight = 800) => `${weight} ${size}px ${FONT}`;

/** Draws text, shrinking it until it fits maxWidth. Returns the size used. */
const fitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  weight = 800,
  minSize = 28,
) => {
  let s = size;
  ctx.font = font(s, weight);
  while (s > minSize && ctx.measureText(text).width > maxWidth) {
    s -= 2;
    ctx.font = font(s, weight);
  }
  let out = text;
  if (ctx.measureText(out).width > maxWidth) {
    while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1);
    out = `${out}…`;
  }
  ctx.fillText(out, x, y);
  return s;
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const panel = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  roundRect(ctx, x, y, w, h, 36);
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fill();
  ctx.strokeStyle = "rgba(217,180,90,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
};

/** Background, brand header and link footer shared by every card. */
const frame = async (eyebrow: string, url: string, cta = "Open the link for full stats") => {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const bg = ctx.createRadialGradient(W / 2, H * 0.32, 60, W / 2, H * 0.5, H * 0.85);
  bg.addColorStop(0, "#1d4a3c");
  bg.addColorStop(0.5, GREEN);
  bg.addColorStop(1, "#06110d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Gold rule top and bottom, like an honours board.
  ctx.fillStyle = GOLD;
  ctx.fillRect(0, 0, W, 10);
  ctx.fillRect(0, H - 10, W, 10);

  const logo = await loadImage(LOGO_SRC);
  if (logo) ctx.drawImage(logo, W / 2 - 80, 120, 160, 160);
  ctx.textAlign = "center";
  ctx.fillStyle = GOLD_LIGHT;
  ctx.font = font(34, 900);
  ctx.fillText("CRICKET SCORE COUNTER", W / 2, 345);
  ctx.fillStyle = SOFT;
  ctx.font = font(32, 700);
  ctx.fillText(eyebrow, W / 2, 400);

  // Footer: where to open it.
  const short = url.replace(/^https?:\/\/(www\.)?/, "");
  ctx.font = font(34, 800);
  const pillW = Math.min(W - 160, ctx.measureText(short).width + 100);
  roundRect(ctx, W / 2 - pillW / 2, H - 250, pillW, 84, 42);
  ctx.fillStyle = WHITE;
  ctx.fill();
  ctx.fillStyle = GREEN;
  fitText(ctx, short, W / 2, H - 196, pillW - 60, 34, 800, 24);
  ctx.fillStyle = SOFT;
  ctx.font = font(30, 700);
  ctx.fillText(cta, W / 2, H - 110);
  ctx.textAlign = "left";
  return { canvas, ctx };
};

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't create the image"))), "image/png"),
  );

const statGrid = (ctx: CanvasRenderingContext2D, stats: CardStat[], top: number) => {
  const cols = stats.length > 4 ? 3 : 2;
  const gap = 28;
  const x0 = 90;
  const cw = (W - x0 * 2 - gap * (cols - 1)) / cols;
  const ch = 210;
  stats.slice(0, 6).forEach((s, i) => {
    const x = x0 + (i % cols) * (cw + gap);
    const y = top + Math.floor(i / cols) * (ch + gap);
    panel(ctx, x, y, cw, ch);
    ctx.textAlign = "center";
    ctx.fillStyle = i === 0 ? GOLD_LIGHT : WHITE;
    fitText(ctx, s.value, x + cw / 2, y + 120, cw - 40, 84, 900, 40);
    ctx.fillStyle = SOFT;
    fitText(ctx, s.label.toUpperCase(), x + cw / 2, y + 172, cw - 30, 30, 800, 22);
  });
  ctx.textAlign = "left";
  return top + Math.ceil(Math.min(stats.length, 6) / cols) * (ch + gap);
};

/** Player profile: avatar, name, handle and headline stats. */
export const playerStoryCard = async (p: {
  name: string;
  handle?: string;
  subtitle?: string;
  avatarUrl?: string;
  stats: CardStat[];
  badge?: string;
  url: string;
}): Promise<Blob> => {
  const { canvas, ctx } = await frame("PLAYER PROFILE", p.url);
  const cx = W / 2;
  const cy = 620;
  const r = 150;
  // Avatar in a gold ring (initials if the photo can't be drawn).
  ctx.beginPath();
  ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const avatar = await loadImage(p.avatarUrl ?? "", true);
  let drew = false;
  if (avatar) {
    try {
      const s = Math.min(avatar.width, avatar.height);
      ctx.drawImage(avatar, (avatar.width - s) / 2, (avatar.height - s) / 2, s, s, cx - r, cy - r, r * 2, r * 2);
      ctx.getImageData(cx, cy, 1, 1); // throws if the photo tainted the canvas
      drew = true;
    } catch {
      drew = false;
    }
  }
  if (!drew) {
    ctx.fillStyle = "#24584a";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = GOLD_LIGHT;
    ctx.font = font(130, 900);
    ctx.textAlign = "center";
    const initials = p.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
    ctx.fillText(initials || "?", cx, cy + 46);
  }
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = WHITE;
  fitText(ctx, p.name, cx, 920, W - 160, 88, 900, 44);
  let y = 975;
  if (p.handle) {
    ctx.fillStyle = GOLD_LIGHT;
    fitText(ctx, p.handle, cx, y, W - 200, 40, 700, 26);
    y += 52;
  }
  if (p.subtitle) {
    ctx.fillStyle = SOFT;
    fitText(ctx, p.subtitle, cx, y, W - 200, 36, 600, 24);
    y += 40;
  }
  const after = statGrid(ctx, p.stats, Math.max(y + 40, 1080));
  if (p.badge) {
    ctx.font = font(36, 800);
    const bw = ctx.measureText(p.badge).width + 80;
    roundRect(ctx, cx - bw / 2, after + 10, bw, 76, 38);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.fillStyle = GREEN;
    ctx.textAlign = "center";
    ctx.fillText(p.badge, cx, after + 61);
  }
  return toBlob(canvas);
};

/** Live or finished match: teams with scores and the status line. */
export const matchStoryCard = async (p: {
  heading: string;
  live: boolean;
  teams: Array<{ name: string; score?: string; overs?: string; batting?: boolean }>;
  status?: string;
  url: string;
}): Promise<Blob> => {
  const { canvas, ctx } = await frame(p.live ? "LIVE SCORE" : "MATCH RESULT", p.url, p.live ? "Open the link to watch live" : "Open the link for the full scorecard");
  ctx.textAlign = "center";
  ctx.fillStyle = WHITE;
  fitText(ctx, p.heading, W / 2, 560, W - 180, 60, 900, 34);
  if (p.live) {
    ctx.font = font(36, 900);
    const lw = 190;
    roundRect(ctx, W / 2 - lw / 2, 610, lw, 70, 35);
    ctx.fillStyle = "#e53935";
    ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.fillText("● LIVE", W / 2, 658);
  }
  let y = 760;
  p.teams.slice(0, 2).forEach((t) => {
    panel(ctx, 90, y, W - 180, 260);
    ctx.textAlign = "left";
    ctx.fillStyle = t.batting ? GOLD_LIGHT : WHITE;
    fitText(ctx, t.name, 140, y + 95, W - 280, 54, 900, 30);
    ctx.fillStyle = WHITE;
    ctx.font = font(110, 900);
    ctx.fillText(t.score || "Yet to bat", 140, y + 215);
    if (t.overs) {
      const sw = ctx.measureText(t.score || "").width;
      ctx.fillStyle = SOFT;
      ctx.font = font(46, 700);
      ctx.fillText(`(${t.overs} ov)`, 140 + sw + 24, y + 212);
    }
    y += 300;
  });
  if (p.status) {
    ctx.textAlign = "center";
    ctx.fillStyle = GOLD_LIGHT;
    const words = p.status.split(" ");
    let line = "";
    let ly = y + 70;
    ctx.font = font(46, 800);
    words.forEach((w) => {
      const next = line ? `${line} ${w}` : w;
      if (ctx.measureText(next).width > W - 200 && line) {
        ctx.fillText(line, W / 2, ly);
        line = w;
        ly += 60;
      } else line = next;
    });
    if (line) ctx.fillText(line, W / 2, ly);
  }
  return toBlob(canvas);
};

/** Tournament: name, details and the top of the points table. */
export const tournamentStoryCard = async (p: {
  name: string;
  subtitle?: string;
  status?: string;
  rows: Array<{ rank: number; name: string; played: number; won: number; points: number }>;
  url: string;
}): Promise<Blob> => {
  const { canvas, ctx } = await frame("TOURNAMENT", p.url, "Open the link for results and live scores");
  ctx.textAlign = "center";
  ctx.fillStyle = WHITE;
  fitText(ctx, p.name, W / 2, 570, W - 160, 86, 900, 44);
  let y = 640;
  if (p.subtitle) {
    ctx.fillStyle = SOFT;
    fitText(ctx, p.subtitle, W / 2, y, W - 200, 38, 700, 24);
    y += 60;
  }
  if (p.status) {
    ctx.font = font(34, 900);
    const sw = ctx.measureText(p.status).width + 70;
    roundRect(ctx, W / 2 - sw / 2, y, sw, 66, 33);
    ctx.fillStyle = p.status.toLowerCase() === "live" ? "#e53935" : GOLD;
    ctx.fill();
    ctx.fillStyle = p.status.toLowerCase() === "live" ? WHITE : GREEN;
    ctx.fillText(p.status.toUpperCase(), W / 2, y + 46);
    y += 110;
  }
  const rows = p.rows.slice(0, 6);
  if (rows.length) {
    const top = Math.max(y + 20, 860);
    const rh = 112;
    panel(ctx, 70, top, W - 140, 90 + rows.length * rh);
    ctx.font = font(30, 800);
    ctx.fillStyle = SOFT;
    ctx.textAlign = "left";
    ctx.fillText("POINTS TABLE", 120, top + 62);
    ctx.textAlign = "right";
    ctx.fillText("P", 720, top + 62);
    ctx.fillText("W", 820, top + 62);
    ctx.fillText("PTS", W - 120, top + 62);
    rows.forEach((r, i) => {
      const ry = top + 90 + i * rh;
      if (i > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(110, ry, W - 220, 2);
      }
      const base = ry + 72;
      ctx.textAlign = "left";
      ctx.fillStyle = i === 0 ? GOLD_LIGHT : SOFT;
      ctx.font = font(44, 900);
      ctx.fillText(String(r.rank), 120, base);
      ctx.fillStyle = i === 0 ? GOLD_LIGHT : WHITE;
      fitText(ctx, r.name, 190, base, 460, 44, 800, 28);
      ctx.textAlign = "right";
      ctx.fillStyle = WHITE;
      ctx.font = font(44, 700);
      ctx.fillText(String(r.played), 720, base);
      ctx.fillText(String(r.won), 820, base);
      ctx.fillStyle = i === 0 ? GOLD_LIGHT : WHITE;
      ctx.font = font(48, 900);
      ctx.fillText(String(r.points), W - 120, base);
    });
  }
  return toBlob(canvas);
};

// ---------------------------------------------------------------- helpers

type CareerLike = {
  matches: number;
  wins: number;
  batting: { runs: number; highest: number; highestNotOut: boolean; strikeRate: number | null };
  bowling: { wickets: number; bestWickets: number; bestRuns: number };
};

/** Story card for a player profile from their career stats. */
export const playerCardFromCareer = (p: {
  name: string;
  username: string;
  role?: string;
  city?: string;
  avatarUrl?: string;
  stats?: CareerLike | null;
  achievements?: number;
  url: string;
}) => {
  const s = p.stats;
  const stats: CardStat[] = s
    ? [
        { label: "Runs", value: String(s.batting.runs) },
        { label: "Matches", value: String(s.matches) },
        { label: "Wickets", value: String(s.bowling.wickets) },
        { label: "Best score", value: s.batting.highest ? `${s.batting.highest}${s.batting.highestNotOut ? "*" : ""}` : "–" },
        { label: "Best bowling", value: s.bowling.bestWickets ? `${s.bowling.bestWickets}/${s.bowling.bestRuns}` : "–" },
        { label: "Win %", value: s.matches ? `${Math.round((s.wins / s.matches) * 100)}%` : "–" },
      ]
    : [];
  return playerStoryCard({
    name: p.name,
    handle: `@${p.username}`,
    subtitle: [p.role, p.city].filter(Boolean).join(" · "),
    avatarUrl: p.avatarUrl,
    stats,
    badge: p.achievements ? `🏆 ${p.achievements} achievement${p.achievements === 1 ? "" : "s"}` : undefined,
    url: p.url,
  });
};
