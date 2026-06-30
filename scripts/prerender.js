const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const BUILD_DIR = path.resolve(__dirname, "..", "build");
const SPA_FALLBACK_FILE = path.join(BUILD_DIR, "200.html");

const ROUTES = [
  "/",
  "/about",
  "/app-preferences",
  "/contact",
  "/cricket-scoring-guide",
  "/create-game",
  "/disclaimer",
  "/download-app",
  "/faq",
  "/how-it-works",
  "/join-game",
  "/login",
  "/match-history",
  "/my-teams",
  "/privacy-policy",
  "/reset-password",
  "/scorekeeping-tips",
  "/site-map",
  "/signup",
  "/support",
  "/terms",
  "/cricket-resources",
  "/cricket-rules-guide",
  "/cricket-match-formats",
  "/cricket-statistics-guide",
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

const fileExists = async (filePath) => {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
};

const resolveBrowserLaunchOptions = async () => {
  if (process.platform === "linux") {
    return {
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
    };
  }

  const envExecutable =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    process.env.CHROMIUM_PATH;

  const localCandidates = [
    envExecutable,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].filter(Boolean);

  for (const candidate of localCandidates) {
    if (await fileExists(candidate)) {
      return {
        executablePath: candidate,
        args: [],
        defaultViewport: { width: 1365, height: 768 },
      };
    }
  }

  throw new Error(
    "No Chrome found. Set PUPPETEER_EXECUTABLE_PATH."
  );
};

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
    } catch {}
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
      res.writeHead(500);
      res.end(`Server error: ${error.message}`);
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();

  return {
    server,
    origin: `http://127.0.0.1:${address.port}`,
  };
};

const writeRouteHtml = async (route, html) => {
  const outputDir =
    route === "/" ? BUILD_DIR : path.join(BUILD_DIR, route.replace(/^\/+/, ""));

  await fs.mkdir(outputDir, { recursive: true });

  const outputFile =
    route === "/"
      ? path.join(BUILD_DIR, "index.html")
      : path.join(outputDir, "index.html");

  const finalHtml = html.toLowerCase().startsWith("<!doctype html>")
    ? html
    : `<!DOCTYPE html>${html}`;

  await fs.writeFile(outputFile, finalHtml, "utf8");
};

const inlineRuntimeStyles = async (page) => {
  await page.evaluate(() => {
    const styleSheets = Array.from(document.styleSheets);
    const emotionStyleElements = Array.from(
      document.querySelectorAll('style[data-emotion]')
    );

    emotionStyleElements.forEach((styleElement) => {
      const matchingSheet = styleSheets.find((sheet) => {
        try {
          return sheet.ownerNode === styleElement;
        } catch {
          return false;
        }
      });

      if (!matchingSheet) {
        return;
      }

      try {
        const cssText = Array.from(matchingSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");

        if (cssText.trim()) {
          styleElement.textContent = cssText;
        }
      } catch {
        // Ignore sheets that cannot be serialized.
      }
    });
  });
};

const prerender = async () => {
  const spaShellHtml = await fs.readFile(path.join(BUILD_DIR, "index.html"), "utf8");
  await fs.writeFile(SPA_FALLBACK_FILE, spaShellHtml, "utf8");

  const { server, origin } = await startStaticServer();
  const launchOptions = await resolveBrowserLaunchOptions();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: launchOptions.executablePath,
    args: launchOptions.args,
    defaultViewport: launchOptions.defaultViewport,
  });

  try {
    for (const route of ROUTES) {
      console.log(`\n🔵 Rendering: ${route}`);
      const page = await browser.newPage();
      const pageErrors = [];

      // 🔥 LOG EVERYTHING
      page.on("console", (msg) => {
        console.log(`📦 [${route}]`, msg.text());
      });

      page.on("pageerror", (error) => {
        console.error(`❌ [${route}] PAGE ERROR:`, error.stack || error.message || error);
        pageErrors.push(error.message);
      });

      page.on("response", async (response) => {
        const responseUrl = response.url();
        const contentType = response.headers()["content-type"] || "";
        if (responseUrl.includes(".js") && contentType.includes("text/html")) {
          console.warn(`⚠️ [${route}] JS request returned HTML: ${responseUrl}`);
        }
      });

      await page.setUserAgent("ReactSnap");
      await page.setRequestInterception(true);

      page.on("request", (request) => {
        const url = request.url();
        const requestUrl = new URL(url);
        if (requestUrl.pathname === "/_vercel/speed-insights/script.js") {
          request
            .respond({
              status: 200,
              contentType: "application/javascript; charset=UTF-8",
              body: "",
            })
            .catch(() => {});
        } else if (
          url.startsWith(origin) ||
          url.startsWith("data:") ||
          url.startsWith("blob:")
        ) {
          request.continue().catch(() => {});
        } else if (
          request.resourceType() === "script" ||
          url.includes("googletagmanager.com") ||
          url.includes("googlesyndication.com") ||
          url.includes("google-analytics.com")
        ) {
          request
            .respond({
              status: 200,
              contentType: "application/javascript; charset=UTF-8",
              body: "",
            })
            .catch(() => {});
        } else if (request.resourceType() === "document") {
          request
            .respond({
              status: 204,
              contentType: "text/html; charset=UTF-8",
              body: "",
            })
            .catch(() => {});
        } else {
          request.abort().catch(() => {});
        }
      });

      try {
        const response = await page.goto(`${origin}${route}`, {
          waitUntil: "domcontentloaded", // ✅ safer
          timeout: 120000,
        });

        if (!response || !response.ok()) {
          console.warn(`⚠️ Failed to load ${route}`);
          continue;
        }

        await page.waitForSelector("#root", { timeout: 30000 });

        await page.waitForFunction(() => {
          const root = document.querySelector("#root");
          return root && root.childElementCount > 0;
        });

        await delay(500);

        await inlineRuntimeStyles(page);

        if (pageErrors.length > 0) {
          console.error(`❌ Errors in ${route}:`, pageErrors);
          continue; // ✅ don't break entire build
        }

        const html = await page.content();
        await writeRouteHtml(route, html);

        console.log(`✅ prerendered ${route}`);
      } catch (err) {
        console.error(`🔥 Failed route ${route}:`, err.message);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
};

prerender().catch((error) => {
  console.error("❌ Prerender failed:", error);
  process.exitCode = 1;
});
