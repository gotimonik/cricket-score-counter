const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const puppeteer = require("puppeteer");

const BUILD_DIR = path.resolve(__dirname, "..", "build");
const SPA_FALLBACK_FILE = path.join(BUILD_DIR, "200.html");
const ROUTES = [
  "/",
  "/about",
  "/app-preferences",
  "/create-game",
  "/disclaimer",
  "/download-app",
  "/how-it-works",
  "/join-game",
  "/match-history",
  "/privacy-policy",
];

const CONTENT_TYPES = {
  ".css": "text/css; charset=UTF-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=UTF-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=UTF-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=UTF-8",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveFilePath = async (requestPath) => {
  const normalizedPath = decodeURIComponent(requestPath.split("?")[0].split("#")[0] || "/");
  const trimmedPath = normalizedPath.replace(/^\/+/, "");
  const candidatePaths = [];

  if (!trimmedPath) {
    candidatePaths.push(path.join(BUILD_DIR, "index.html"));
  } else {
    const hasExtension = path.extname(trimmedPath) !== "";
    if (hasExtension) {
      candidatePaths.push(path.join(BUILD_DIR, trimmedPath));
    } else {
      candidatePaths.push(path.join(BUILD_DIR, trimmedPath, "index.html"));
    }
  }

  candidatePaths.push(SPA_FALLBACK_FILE);
  candidatePaths.push(path.join(BUILD_DIR, "index.html"));

  for (const candidate of candidatePaths) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // Keep trying fallback candidates.
    }
  }

  return path.join(BUILD_DIR, "index.html");
};

const startStaticServer = async () => {
  const server = http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      const filePath = await resolveFilePath(requestUrl.pathname);
      const ext = path.extname(filePath).toLowerCase();
      const file = await fs.readFile(filePath);
      res.writeHead(200, {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(file);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
      res.end(`Prerender server error: ${error instanceof Error ? error.message : "unknown"}`);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to determine prerender server port.");
  }

  return {
    server,
    origin: `http://127.0.0.1:${address.port}`,
  };
};

const writeRouteHtml = async (route, html) => {
  const outputDir = route === "/" ? BUILD_DIR : path.join(BUILD_DIR, route.replace(/^\/+/, ""));
  await fs.mkdir(outputDir, { recursive: true });
  const outputFile = route === "/" ? path.join(BUILD_DIR, "index.html") : path.join(outputDir, "index.html");
  const finalHtml = html.toLowerCase().startsWith("<!doctype html>")
    ? html
    : `<!DOCTYPE html>${html}`;
  await fs.writeFile(outputFile, finalHtml, "utf8");
};

const prerender = async () => {
  const spaShellHtml = await fs.readFile(path.join(BUILD_DIR, "index.html"), "utf8");
  await fs.writeFile(SPA_FALLBACK_FILE, spaShellHtml, "utf8");
  const { server, origin } = await startStaticServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      const pageErrors = [];

      await page.setUserAgent("ReactSnap");
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        const url = request.url();
        if (
          url.startsWith(origin) ||
          url.startsWith("data:") ||
          url.startsWith("blob:")
        ) {
          request.continue().catch(() => {});
          return;
        }
        request.abort("blockedbyclient").catch(() => {});
      });
      page.on("pageerror", (error) => {
        pageErrors.push(error.message);
      });

      const response = await page.goto(`${origin}${route}`, {
        waitUntil: "networkidle0",
        timeout: 120000,
      });

      if (!response || !response.ok()) {
        throw new Error(`Failed to load ${route}: ${response ? response.status() : "no response"}`);
      }

      await page.waitForSelector("#root", { timeout: 30000 });
      await page.waitForFunction(
        () => {
          const root = document.querySelector("#root");
          return Boolean(root && root.childElementCount > 0);
        },
        { timeout: 30000 }
      );
      await delay(500);

      if (pageErrors.length > 0) {
        throw new Error(`Runtime errors while prerendering ${route}: ${pageErrors.join(" | ")}`);
      }

      const html = await page.content();
      await writeRouteHtml(route, html);
      await page.close();
      console.log(`prerendered ${route}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
};

prerender().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
