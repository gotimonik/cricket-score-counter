// Single source of truth for the long-form content routes that are generated
// from data files (Learn articles, calculators). Used by prerender.js and
// generate-sitemap.js so a new article is automatically prerendered and
// listed in sitemap.xml without editing three places by hand.
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "..", "src");

const readArticles = () => {
  const dir = path.join(SRC, "content", "articles");
  const articles = [];
  fs.readdirSync(dir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .forEach((file) => {
      const text = fs.readFileSync(path.join(dir, file), "utf8");
      const re = /slug:\s*"([a-z0-9-]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?metaDescription:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?datePublished:\s*"(\d{4}-\d{2}-\d{2})"/g;
      let match;
      while ((match = re.exec(text))) {
        articles.push({
          slug: match[1],
          title: match[2].replace(/\\"/g, '"'),
          description: match[3].replace(/\\"/g, '"'),
          date: match[4],
        });
      }
    });
  return articles;
};

const readCalculatorSlugs = () => {
  const text = fs.readFileSync(
    path.join(SRC, "components", "CricketCalculators.tsx"),
    "utf8",
  );
  const block = text.slice(
    text.indexOf("export const CALCULATORS"),
    text.indexOf("const calculatorPath"),
  );
  return Array.from(block.matchAll(/slug:\s*"([a-z0-9-]+)"/g)).map((m) => m[1]);
};

const getArticles = () => readArticles();

const getGeneratedContentRoutes = () => [
  "/learn",
  ...readArticles().map((a) => `/learn/${a.slug}`),
  "/cricket-glossary",
  "/cricket-calculators",
  ...readCalculatorSlugs().map((slug) => `/cricket-calculators/${slug}`),
];

module.exports = { getArticles, getGeneratedContentRoutes, readCalculatorSlugs };
