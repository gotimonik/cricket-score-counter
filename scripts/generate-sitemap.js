// Regenerates public/sitemap.xml and public/feed.xml from the static page
// list below plus the Learn articles and calculators (see content-routes.js).
// Runs automatically before every build (npm "prebuild").
const fs = require("fs");
const path = require("path");
const { getArticles, readCalculatorSlugs } = require("./content-routes");

const SITE = "https://www.cricket-score-counter.com";
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_PAGES = [
  ["/", "daily", "1.0"],
  ["/learn", "weekly", "0.9"],
  ["/cricket-resources", "monthly", "0.8"],
  ["/cricket-glossary", "monthly", "0.8"],
  ["/cricket-calculators", "monthly", "0.8"],
  ["/cricket-rules-guide", "monthly", "0.8"],
  ["/cricket-match-formats", "monthly", "0.8"],
  ["/cricket-statistics-guide", "monthly", "0.8"],
  ["/cricket-tournament-guide", "monthly", "0.8"],
  ["/cricket-scoring-guide", "monthly", "0.7"],
  ["/scorekeeping-tips", "monthly", "0.7"],
  ["/how-it-works", "monthly", "0.7"],
  ["/faq", "monthly", "0.7"],
  ["/tournaments", "weekly", "0.7"],
  ["/download-app", "weekly", "0.6"],
  ["/about", "monthly", "0.6"],
  ["/support", "monthly", "0.6"],
  ["/contact", "monthly", "0.5"],
  ["/site-map", "monthly", "0.4"],
  ["/privacy-policy", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"],
  ["/disclaimer", "yearly", "0.3"],
];

const escapeXml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const urlEntry = (loc, lastmod, changefreq, priority) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const articles = getArticles();
const calculators = readCalculatorSlugs();

const entries = [
  ...STATIC_PAGES.map(([loc, freq, prio]) => urlEntry(loc, TODAY, freq, prio)),
  ...articles.map((a) => urlEntry(`/learn/${a.slug}`, a.date, "monthly", "0.7")),
  ...calculators.map((slug) =>
    urlEntry(`/cricket-calculators/${slug}`, TODAY, "monthly", "0.7"),
  ),
];

fs.writeFileSync(
  path.join(PUBLIC_DIR, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`,
);

// Older hand-written guide pages, kept in the feed alongside the articles.
const LEGACY_GUIDES = [
  { path: "/cricket-tournament-guide", title: "Cricket Tournament Guide — Teams, Points Table & Player Stats", description: "How to run a local cricket tournament — register teams, choose League or Knockout, and track an automatic points table and player leaderboard.", date: "2026-07-02" },
  { path: "/cricket-scoring-guide", title: "Cricket Scoring Guide", description: "A practical guide to cricket scoring, including legal balls, extras, wickets, strike rotation, targets, and local match scorekeeping tips.", date: "2026-07-02" },
  { path: "/cricket-rules-guide", title: "Cricket Rules Guide for Local Matches", description: "A complete cricket rules guide covering batting, bowling, fielding, extras, dismissals, innings structure, and local match variations.", date: "2026-06-24" },
  { path: "/cricket-match-formats", title: "Cricket Match Formats Explained", description: "T20, 50-over, Test, box cricket, tennis ball, gully cricket, pairs cricket, and school formats explained.", date: "2026-06-24" },
  { path: "/cricket-statistics-guide", title: "Cricket Statistics Explained — Batting, Bowling & Team Stats", description: "Batting average, strike rate, economy rate, bowling average, run rate, and more explained.", date: "2026-06-24" },
  { path: "/scorekeeping-tips", title: "Cricket Scorekeeping Tips", description: "Practical cricket scorekeeping tips for local matches, including extras, wickets, over checks, strike rotation, and live score accuracy.", date: "2026-06-17" },
];

const feedItems = [
  ...articles.map((a) => ({ ...a, path: `/learn/${a.slug}` })),
  ...LEGACY_GUIDES,
]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE}${a.path}</link>
      <guid>${SITE}${a.path}</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(`${a.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`,
  );

fs.writeFileSync(
  path.join(PUBLIC_DIR, "feed.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Cricket Score Counter — Learn Cricket</title>
    <link>${SITE}/learn</link>
    <description>Cricket scoring, laws, strategy and local cricket guides from Cricket Score Counter.</description>
    <language>en</language>
${feedItems.join("\n")}
  </channel>
</rss>
`,
);

console.log(
  `sitemap.xml: ${entries.length} URLs, feed.xml: ${feedItems.length} articles`,
);
