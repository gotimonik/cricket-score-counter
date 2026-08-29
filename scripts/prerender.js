const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const BUILD_DIR = path.resolve(__dirname, "..", "build");
const SPA_FALLBACK_FILE = path.join(BUILD_DIR, "200.html");

// Routes that are supposed to carry substantial, unique informational text
// (the pages AdSense/Google reviewers judge for "content value"). Each one is
// held to a minimum visible-word-count below, and the whole build FAILS if
// one comes out too thin instead of silently shipping a near-empty page.
const CONTENT_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/cricket-scoring-guide",
  "/disclaimer",
  "/download-app",
  "/faq",
  "/how-it-works",
  "/privacy-policy",
  "/scorekeeping-tips",
  "/site-map",
  "/support",
  "/terms",
  "/cricket-resources",
  "/cricket-rules-guide",
  "/cricket-match-formats",
  "/cricket-statistics-guide",
  // Was missing from this list entirely -- meaning this page (linked from
  // the footer of nearly every other page) has always served the bare,
  // unrendered app shell to anything that doesn't execute JS, instead of its
  // actual guide content.
  "/cricket-tournament-guide",
];

// App/utility screens (auth, live scoring setup, account pages). These are
// expected to be text-light by nature -- a thin render here is normal, not a
// bug -- so they're prerendered for correctness but never fail the build.
const APP_ROUTES = [
  "/account",
  "/app-preferences",
  "/create-game",
  "/join-game",
  "/login",
  "/match-history",
  "/my-teams",
  "/reset-password",
  "/signup",
  "/tournaments",
];

const ROUTES = [...CONTENT_ROUTES, ...APP_ROUTES];

// A content page rendering below this many visible words almost certainly
// means prerendering silently failed (chromium hiccup, a thrown error that
// got swallowed, a route that regressed to the bare app shell) rather than
// that the page is genuinely this short -- every content route in this app
// normally renders 150-2,800+ words.
const MIN_CONTENT_WORD_COUNT = 120;

// One retry per route before giving up, since a single-shot headless-chromium
// run in a CI build sandbox can be flaky for reasons unrelated to the app
// (a slow cold start, a transient timeout) -- this avoids failing the whole
// deploy over a fluke while still catching a real regression.
const MAX_ATTEMPTS_PER_ROUTE = 2;

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

// Renders one route once and reports what happened, instead of swallowing
// the failure -- the caller decides whether to retry and whether a failure
// here is allowed to fail the build.
const attemptRenderRoute = async (browser, origin, route) => {
  const page = await browser.newPage();
  const pageErrors = [];

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
      return { ok: false, reason: `HTTP response not ok for ${route}` };
    }

    await page.waitForSelector("#root", { timeout: 30000 });

    await page.waitForFunction(() => {
      const root = document.querySelector("#root");
      return root && root.childElementCount > 0;
    });

    await delay(500);

    await inlineRuntimeStyles(page);

    if (pageErrors.length > 0) {
      return { ok: false, reason: `Page errors: ${pageErrors.join("; ")}` };
    }

    // Visible-text word count as the browser actually shows it (innerText
    // respects rendering, so the <noscript> fallback and hidden elements
    // don't inflate this) -- this is what tells us whether the route
    // genuinely rendered its content or quietly fell back to a bare shell.
    const wordCount = await page.evaluate(() => {
      const text = document.body.innerText || "";
      return text.trim().split(/\s+/).filter(Boolean).length;
    });

    const html = await page.content();
    await writeRouteHtml(route, html);

    return { ok: true, wordCount };
  } catch (err) {
    return { ok: false, reason: err.message };
  } finally {
    await page.close();
  }
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

  // Routes that end up too thin (or fail outright) to ship as "content"
  // pages -- collected across the whole run so one bad route doesn't get
  // silently skipped while the rest of the build sails through.
  const contentFailures = [];

  try {
    for (const route of ROUTES) {
      console.log(`\n🔵 Rendering: ${route}`);
      const isContentRoute = CONTENT_ROUTES.includes(route);
      let result = { ok: false, reason: "not attempted" };

      for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_ROUTE; attempt += 1) {
        result = await attemptRenderRoute(browser, origin, route);

        if (result.ok && isContentRoute && result.wordCount < MIN_CONTENT_WORD_COUNT) {
          result = {
            ok: false,
            reason: `only ${result.wordCount} visible words (minimum ${MIN_CONTENT_WORD_COUNT} for a content route)`,
          };
        }

        if (result.ok) break;

        if (attempt < MAX_ATTEMPTS_PER_ROUTE) {
          console.warn(`⚠️ [${route}] attempt ${attempt} failed (${result.reason}); retrying…`);
        }
      }

      if (result.ok) {
        console.log(
          `✅ prerendered ${route}${
            result.wordCount !== undefined ? ` (${result.wordCount} words)` : ""
          }`,
        );
      } else if (isContentRoute) {
        console.error(`🔥 Content route failed after ${MAX_ATTEMPTS_PER_ROUTE} attempt(s): ${route} -- ${result.reason}`);
        contentFailures.push({ route, reason: result.reason });
      } else {
        // App/utility routes are allowed to render thin or even fail here --
        // the SPA fallback (200.html) still serves them client-side.
        console.warn(`⚠️ App route did not prerender (non-fatal): ${route} -- ${result.reason}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (contentFailures.length > 0) {
    console.error(
      `\n❌ ${contentFailures.length} content route(s) failed to prerender with enough visible text:`,
    );
    contentFailures.forEach(({ route, reason }) =>
      console.error(`   - ${route}: ${reason}`),
    );
    console.error(
      "\nFailing the build instead of shipping thin/blank content pages -- these are exactly the pages an AdSense/SEO reviewer judges the site by.",
    );
    process.exitCode = 1;
  }
};

prerender().catch((error) => {
  console.error("❌ Prerender failed:", error);
  process.exitCode = 1;
});
