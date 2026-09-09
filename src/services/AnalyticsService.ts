import AuthService from "./AuthService";

export type AnalyticsEventType =
  | "PAGE_VIEW"
  | "USER_SIGNUP"
  | "USER_LOGIN"
  | "TOURNAMENT_CREATED"
  | "MATCH_STARTED"
  | "MATCH_COMPLETED"
  // Home-page ad/promo banner instrumentation -- see
  // trackPromoBannerView/trackPromoBannerClick below and
  // PromoBannerCard.tsx, which fires them.
  | "PROMO_BANNER_VIEW"
  | "PROMO_BANNER_CLICK";

const SESSION_ID_KEY = "cricket-analytics-session-id";

const generateId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

// Persists a per-browser anonymous id so daily-active-visitor counts still
// work for people who aren't logged in. Best-effort: falls back to an
// in-memory id (still sent, just not persisted) if storage is unavailable.
let inMemorySessionId: string | null = null;

const getSessionId = (): string => {
  try {
    const existing = window.localStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const created = generateId();
    window.localStorage.setItem(SESSION_ID_KEY, created);
    return created;
  } catch {
    if (!inMemorySessionId) {
      inMemorySessionId = generateId();
    }
    return inMemorySessionId;
  }
};

// Same headless-crawler check used elsewhere in the app (see App.tsx,
// Home.tsx, etc.) -- the build's prerender step visits every route with
// this user agent, and it has no real visitor or network path to the
// backend, so there's nothing worth recording (and no point trying).
const isPrerenderUserAgent = (): boolean =>
  typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";

// Fire-and-forget: analytics must never throw or block the UI, so every
// failure (network, backend down, blocked by an ad blocker, etc.) is
// swallowed silently.
const track = (
  type: AnalyticsEventType,
  options?: { path?: string; metadata?: Record<string, unknown> },
): void => {
  if (isPrerenderUserAgent()) {
    return;
  }

  AuthService.request("/analytics/track", {
    method: "POST",
    body: JSON.stringify({
      type,
      sessionId: getSessionId(),
      path: options?.path,
      metadata: options?.metadata,
    }),
  }).catch(() => {
    // Ignored on purpose.
  });
};

export type AnalyticsSummaryRange = {
  activeUsers: number;
  newSignups: number;
  logins: number;
  tournamentsCreated: number;
  matchesStarted: number;
  matchesCompleted: number;
  pageViews: number;
  promoBannerViews: number;
  promoBannerClicks: number;
};

export type AnalyticsSummary = {
  today: AnalyticsSummaryRange;
  last7Days: AnalyticsSummaryRange;
  last30Days: AnalyticsSummaryRange;
  topPages: { path: string; views: number }[];
  topBanners: { bannerId: string; title: string; clicks: number }[];
};

export type AnalyticsDailyBucket = AnalyticsSummaryRange & { day: string };

// Admin-only endpoints -- the backend rejects these for anyone whose email
// isn't allowlisted (see ANALYTICS_ADMIN_EMAILS on the server).
const getSummary = (): Promise<AnalyticsSummary> =>
  AuthService.request<AnalyticsSummary>("/analytics/summary", {
    method: "GET",
  });

const getDaily = (days = 14): Promise<AnalyticsDailyBucket[]> =>
  AuthService.request<{ days: AnalyticsDailyBucket[] }>(
    `/analytics/daily?days=${days}`,
    { method: "GET" },
  ).then((response) => response.days ?? []);

// A minimal, banner-shaped identity -- callers just pass the
// PromoBannerRecord they already have.
type TrackableBanner = { id: string; slot: string; title?: string };

export const AnalyticsService = {
  track,
  trackPageView: (path: string) => track("PAGE_VIEW", { path }),
  // Fires once per banner while it's actually visible in the viewport --
  // see the IntersectionObserver in PromoBannerCard.tsx. `position` is
  // 1-based (which slide this was) and `total` is how many banners were
  // in rotation, so "banner 2 of 4" style reporting is possible later.
  trackPromoBannerView: (
    banner: TrackableBanner,
    position?: number,
    total?: number,
  ) =>
    track("PROMO_BANNER_VIEW", {
      metadata: {
        bannerId: banner.id,
        slot: banner.slot,
        title: banner.title,
        position,
        total,
      },
    }),
  // Fires when either of a banner's buttons is clicked.
  trackPromoBannerClick: (
    banner: TrackableBanner,
    cta: { kind: "primary" | "secondary"; buttonText?: string; url?: string },
  ) =>
    track("PROMO_BANNER_CLICK", {
      metadata: {
        bannerId: banner.id,
        slot: banner.slot,
        title: banner.title,
        ctaKind: cta.kind,
        buttonText: cta.buttonText,
        url: cta.url,
      },
    }),
  getSummary,
  getDaily,
};

export default AnalyticsService;
