// Printable / shareable "Certificate of Achievement" for an award a player
// earned, drawn on a canvas (landscape, A4 proportions) in the Pavilion look:
// parchment, board-green frame, gold rules and a tier-coloured seal.

import type { AchievementTier } from "./careerInsights";

const W = 1600;
const H = 1131;
const GREEN = "#0F2E25";
const GOLD = "#D9B45A";
const GOLD_DARK = "#9a7520";
const INK = "#2b3a34";
const SERIF = `Georgia, "Times New Roman", Times, serif`;
const SANS = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const LOGO_SRC = "/images/new_logo.png";

const SEALS: Record<AchievementTier, { light: string; mid: string; dark: string; label: string; ribbon: [string, string] }> = {
  bronze: { light: "#f6d2a8", mid: "#c98a4b", dark: "#7a4a1c", label: "BRONZE", ribbon: ["#2f6b52", "#1d4b3b"] },
  silver: { light: "#ffffff", mid: "#c3ccd6", dark: "#6f7d8b", label: "SILVER", ribbon: ["#2c5f9e", "#1b3f6e"] },
  gold: { light: "#fff2b8", mid: "#e0aa1f", dark: "#8a6200", label: "GOLD", ribbon: ["#b5382b", "#7e2318"] },
  platinum: { light: "#f4f7ff", mid: "#a9b8ff", dark: "#5d55c9", label: "PLATINUM", ribbon: ["#3a2f8f", "#211a5e"] },
};

export interface CertificateInput {
  playerName: string;
  awardTitle: string;
  awardDescription: string;
  tier: AchievementTier;
  /** e.g. "vs Kothrud Kings · Pune Premier League" */
  matchLine?: string;
  /** Date the award was earned (ISO); falls back to today. */
  date?: string;
  url: string;
  count?: number;
}

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const fit = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, size: number, family: string, weight = "700", style = "normal", min = 24) => {
  let s = size;
  const set = () => (ctx.font = `${style} ${weight} ${s}px ${family}`);
  set();
  while (s > min && ctx.measureText(text).width > maxW) {
    s -= 2;
    set();
  }
  let out = text;
  if (ctx.measureText(out).width > maxW) {
    while (out.length > 1 && ctx.measureText(`${out}…`).width > maxW) out = out.slice(0, -1);
    out = `${out}…`;
  }
  ctx.fillText(out, x, y);
  return ctx.measureText(out).width;
};

const diamond = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
};

const rule = (ctx: CanvasRenderingContext2D, cx: number, y: number, half: number) => {
  const g = ctx.createLinearGradient(cx - half, 0, cx + half, 0);
  g.addColorStop(0, "rgba(217,180,90,0)");
  g.addColorStop(0.5, GOLD);
  g.addColorStop(1, "rgba(217,180,90,0)");
  ctx.fillStyle = g;
  ctx.fillRect(cx - half, y - 1.5, half * 2, 3);
  ctx.fillStyle = GOLD;
  diamond(ctx, cx, y, 9);
};

const formatDay = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
};

export const drawCertificate = async (p: CertificateInput): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Parchment.
  const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.75);
  bg.addColorStop(0, "#fffdf6");
  bg.addColorStop(0.7, "#f8f0dc");
  bg.addColorStop(1, "#eadcb8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // Faint outfield stripes.
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.fillStyle = GREEN;
  for (let x = -H; x < W; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.lineTo(x + 45, H);
    ctx.lineTo(x + 45 + H * 0.18, 0);
    ctx.lineTo(x + H * 0.18, 0);
    ctx.fill();
  }
  ctx.restore();

  // Frame: green band, gold rule, fine inner rule, corner diamonds.
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 26;
  ctx.strokeRect(13, 13, W - 26, H - 26);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 5;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.strokeStyle = "rgba(154,117,32,0.55)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 60, W - 120, H - 120);
  ctx.fillStyle = GOLD;
  [
    [46, 46],
    [W - 46, 46],
    [46, H - 46],
    [W - 46, H - 46],
  ].forEach(([x, y]) => diamond(ctx, x, y, 16));

  ctx.textAlign = "center";
  const cx = W / 2;

  const logo = await loadImage(LOGO_SRC);
  if (logo) ctx.drawImage(logo, cx - 42, 92, 84, 84);
  ctx.fillStyle = GOLD_DARK;
  ctx.font = `800 22px ${SANS}`;
  ctx.fillText("C R I C K E T   S C O R E   C O U N T E R", cx, 210);

  ctx.fillStyle = GREEN;
  fit(ctx, "Certificate of Achievement", cx, 292, W - 300, 70, SERIF, "700");
  rule(ctx, cx, 326, 260);

  ctx.fillStyle = "#5d6b64";
  ctx.font = `italic 400 30px ${SERIF}`;
  ctx.fillText("This certificate is proudly presented to", cx, 398);

  ctx.fillStyle = GREEN;
  const nameW = fit(ctx, p.playerName, cx, 498, W - 360, 92, SERIF, "700", "normal", 40);
  ctx.fillStyle = GOLD;
  ctx.fillRect(cx - Math.max(220, nameW / 2 + 40), 524, Math.max(440, nameW + 80), 3);

  ctx.fillStyle = "#5d6b64";
  ctx.font = `400 28px ${SERIF}`;
  ctx.fillText(p.count && p.count > 1 ? `for earning, ${p.count} times over, the award` : "for earning the award", cx, 590);

  const seal = SEALS[p.tier];
  ctx.fillStyle = seal.dark;
  fit(ctx, p.awardTitle, cx, 668, W - 400, 64, SERIF, "700");
  ctx.fillStyle = INK;
  fit(ctx, p.awardDescription, cx, 722, W - 420, 30, SANS, "600");
  if (p.matchLine) {
    ctx.fillStyle = "#6b7770";
    fit(ctx, p.matchLine, cx, 768, W - 460, 26, SANS, "600");
  }

  // Seal with ribbons, bottom centre.
  const sy = 905;
  const sr = 92;
  [-1, 1].forEach((side) => {
    ctx.save();
    ctx.translate(cx + side * 34, sy + 30);
    ctx.rotate(side * 0.28);
    const rg = ctx.createLinearGradient(0, 0, 0, 90);
    rg.addColorStop(0, seal.ribbon[0]);
    rg.addColorStop(1, seal.ribbon[1]);
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(26, 0);
    ctx.lineTo(26, 90);
    ctx.lineTo(0, 74);
    ctx.lineTo(-26, 90);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  // Scalloped rim.
  ctx.beginPath();
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const r = sr + (i % 2 ? 0 : 7);
    const x = cx + Math.cos(a) * r;
    const y = sy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const rim = ctx.createLinearGradient(cx - sr, sy - sr, cx + sr, sy + sr);
  rim.addColorStop(0, seal.light);
  rim.addColorStop(0.5, seal.mid);
  rim.addColorStop(1, seal.dark);
  ctx.fillStyle = rim;
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fill();
  ctx.shadowColor = "transparent";
  const disc = ctx.createRadialGradient(cx - 25, sy - 30, 10, cx, sy, sr * 0.8);
  disc.addColorStop(0, seal.light);
  disc.addColorStop(0.65, seal.mid);
  disc.addColorStop(1, seal.dark);
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(cx, sy, sr * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, sy, sr * 0.66, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.font = `900 22px ${SANS}`;
  ctx.fillText(seal.label, cx, sy - 6);
  ctx.font = `700 34px ${SERIF}`;
  ctx.fillText("★", cx, sy + 34);

  // Signature lines.
  const lineY = 960;
  const colX = [330, W - 330];
  ctx.strokeStyle = "rgba(15,46,37,0.45)";
  ctx.lineWidth = 2;
  colX.forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x - 170, lineY);
    ctx.lineTo(x + 170, lineY);
    ctx.stroke();
  });
  ctx.fillStyle = GREEN;
  ctx.font = `italic 700 32px ${SERIF}`;
  ctx.fillText(formatDay(p.date), colX[0], lineY - 16);
  ctx.fillText("Cricket Score Counter", colX[1], lineY - 16);
  ctx.fillStyle = "#6b7770";
  ctx.font = `800 18px ${SANS}`;
  ctx.fillText("DATE ACHIEVED", colX[0], lineY + 32);
  ctx.fillText("VERIFIED BY THE SCORECARD", colX[1], lineY + 32);

  ctx.fillStyle = GOLD_DARK;
  ctx.font = `700 20px ${SANS}`;
  // Web address under the seal's ribbon tails (which end around y=1040).
  ctx.fillText(p.url.replace(/^https?:\/\/(www\.)?/, ""), cx, H - 74);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't create the certificate"))), "image/png"),
  );
};
