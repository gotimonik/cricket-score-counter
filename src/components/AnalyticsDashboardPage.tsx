import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { InsightsRounded } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import AnalyticsService, {
  type AnalyticsDailyBucket,
  type AnalyticsSummary,
  type AnalyticsSummaryRange,
} from "../services/AnalyticsService";
import { ADMIN_ANALYTICS_EMAIL } from "../utils/constant";

const METRICS: { key: keyof AnalyticsSummaryRange; label: string }[] = [
  { key: "activeUsers", label: "Active visitors" },
  { key: "newSignups", label: "New signups" },
  { key: "logins", label: "Logins" },
  { key: "tournamentsCreated", label: "Tournaments created" },
  { key: "matchesStarted", label: "Matches started" },
  { key: "matchesCompleted", label: "Matches completed" },
  { key: "pageViews", label: "Page views" },
  { key: "promoBannerViews", label: "Ad banner views" },
  { key: "promoBannerClicks", label: "Ad banner clicks" },
];

const cardSx = {
  p: { xs: 1.75, sm: 2.25 },
  borderRadius: 3,
  border:
    "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
  background: "rgba(255,255,255,0.86)",
  flex: 1,
  minWidth: 220,
};

const RangeCard: React.FC<{ title: string; range: AnalyticsSummaryRange }> = ({
  title,
  range,
}) => (
  <Paper elevation={0} sx={cardSx}>
    <Typography
      sx={{
        fontWeight: 900,
        color: "var(--app-accent-text, #185a9d)",
        fontSize: "calc(15px * var(--app-font-scale, 1))",
        mb: 1.2,
      }}
    >
      {title}
    </Typography>
    <Stack spacing={0.7}>
      {METRICS.map((metric) => (
        <Stack
          key={metric.key}
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography
            sx={{
              color: "#526274",
              fontWeight: 650,
              fontSize: "calc(12.5px * var(--app-font-scale, 1))",
            }}
          >
            {metric.label}
          </Typography>
          <Typography
            sx={{
              color: "#0c3558",
              fontWeight: 900,
              fontSize: "calc(15px * var(--app-font-scale, 1))",
            }}
          >
            {range[metric.key].toLocaleString()}
          </Typography>
        </Stack>
      ))}
    </Stack>
  </Paper>
);

const AnalyticsDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<"checking" | "denied" | "ready">(
    "checking",
  );
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate("/login", { state: { next_redirect: location.pathname } });
      return;
    }

    const user = AuthService.getUser() as { email?: string } | null;
    if (user?.email?.toLowerCase() !== ADMIN_ANALYTICS_EMAIL) {
      setStatus("denied");
      return;
    }

    setStatus("ready");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cached under a fixed key so switching away from this admin page and
  // back (or a background refocus) revalidates instead of blanking the
  // dashboard back to a loading state every time.
  const { data: analyticsData, error: analyticsError } = useSWR(
    status === "ready" ? "admin-analytics" : null,
    () =>
      Promise.all([AnalyticsService.getSummary(), AnalyticsService.getDaily(14)]),
  );

  const summary: AnalyticsSummary | null = analyticsData?.[0] ?? null;
  const daily: AnalyticsDailyBucket[] = analyticsData?.[1] ?? [];

  useEffect(() => {
    if (analyticsError) {
      setLoadError(
        analyticsError instanceof Error
          ? analyticsError.message
          : t("Unable to load analytics right now."),
      );
    }
  }, [analyticsError, t]);

  return (
    <>
      <MetaHelmet
        pageTitle={t("Analytics")}
        canonical={location.pathname}
        description={t("Daily activity tracking for Cricket Score Counter.")}
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 980, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3 },
            }}
          >
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(24px * var(--app-font-scale, 1))",
                  sm: "calc(30px * var(--app-font-scale, 1))",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <InsightsRounded sx={{ color: "#0b7f61" }} />
                <span>{t("Analytics")}</span>
              </Stack>
            </PageTitleWithBack>

            {status === "checking" && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {status === "denied" && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {t("This page is only available to the app owner.")}
              </Alert>
            )}

            {status === "ready" && loadError && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                {loadError}
              </Alert>
            )}

            {status === "ready" && !loadError && !summary && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {status === "ready" && summary && (
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1.5}
                  sx={{ flexWrap: "wrap" }}
                >
                  <RangeCard title={t("Today")} range={summary.today} />
                  <RangeCard
                    title={t("Last 7 days")}
                    range={summary.last7Days}
                  />
                  <RangeCard
                    title={t("Last 30 days")}
                    range={summary.last30Days}
                  />
                </Stack>

                <Paper elevation={0} sx={cardSx}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "var(--app-accent-text, #185a9d)",
                      fontSize: "calc(15px * var(--app-font-scale, 1))",
                      mb: 1.2,
                    }}
                  >
                    {t("Most viewed pages (last 7 days)")}
                  </Typography>
                  {summary.topPages.length === 0 ? (
                    <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                      {t("No page views recorded yet.")}
                    </Typography>
                  ) : (
                    <Stack spacing={0.7}>
                      {summary.topPages.map((page) => (
                        <Stack
                          key={page.path}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                        >
                          <Typography
                            sx={{
                              color: "#0c3558",
                              fontWeight: 650,
                              fontSize: "calc(13px * var(--app-font-scale, 1))",
                              wordBreak: "break-all",
                            }}
                          >
                            {page.path}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#0b7f61",
                              fontWeight: 900,
                              fontSize: "calc(13px * var(--app-font-scale, 1))",
                              flexShrink: 0,
                              pl: 1,
                            }}
                          >
                            {page.views.toLocaleString()}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Paper>

                <Paper elevation={0} sx={cardSx}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "var(--app-accent-text, #185a9d)",
                      fontSize: "calc(15px * var(--app-font-scale, 1))",
                      mb: 1.2,
                    }}
                  >
                    {t("Most clicked ad banners (last 7 days)")}
                  </Typography>
                  {summary.topBanners.length === 0 ? (
                    <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                      {t("No banner clicks recorded yet.")}
                    </Typography>
                  ) : (
                    <Stack spacing={0.7}>
                      {summary.topBanners.map((entry) => (
                        <Stack
                          key={entry.bannerId}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                        >
                          <Typography
                            sx={{
                              color: "#0c3558",
                              fontWeight: 650,
                              fontSize: "calc(13px * var(--app-font-scale, 1))",
                              wordBreak: "break-word",
                            }}
                          >
                            {entry.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#0b7f61",
                              fontWeight: 900,
                              fontSize: "calc(13px * var(--app-font-scale, 1))",
                              flexShrink: 0,
                              pl: 1,
                            }}
                          >
                            {entry.clicks.toLocaleString()}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Paper>

                <Paper elevation={0} sx={{ ...cardSx, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: "var(--app-accent-text, #185a9d)",
                      fontSize: "calc(15px * var(--app-font-scale, 1))",
                      mb: 1.2,
                    }}
                  >
                    {t("Last 14 days")}
                  </Typography>
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>
                            {t("Day")}
                          </TableCell>
                          {METRICS.map((metric) => (
                            <TableCell
                              key={metric.key}
                              align="right"
                              sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
                            >
                              {t(metric.label)}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...daily].reverse().map((bucket) => (
                          <TableRow key={bucket.day}>
                            <TableCell sx={{ fontWeight: 700 }}>
                              {bucket.day}
                            </TableCell>
                            {METRICS.map((metric) => (
                              <TableCell key={metric.key} align="right">
                                {bucket[metric.key].toLocaleString()}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default AnalyticsDashboardPage;
