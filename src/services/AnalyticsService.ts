import AuthService from "./AuthService";

export type AnalyticsEventType =
  | "PAGE_VIEW"
  | "USER_SIGNUP"
  | "USER_LOGIN"
  | "TOURNAMENT_CREATED"
  | "MATCH_STARTED"
  | "MATCH_COMPLETED";

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

// Fire-and-forget: analytics must never throw or block the UI, so every
// failure (network, backend down, blocked by an ad blocker, etc.) is
// swallowed silently.
const track = (
  type: AnalyticsEventType,
  options?: { path?: string; metadata?: Record<string, unknown> },
): void => {
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
};

export type AnalyticsSummary = {
  today: AnalyticsSummaryRange;
  last7Days: AnalyticsSummaryRange;
  last30Days: AnalyticsSummaryRange;
  topPages: { path: string; views: number }[];
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

export const AnalyticsService = {
  track,
  trackPageView: (path: string) => track("PAGE_VIEW", { path }),
  getSummary,
  getDaily,
};

export default AnalyticsService;
