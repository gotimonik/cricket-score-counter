import React from "react";
import {
  ArrowForwardIosRounded,
  EmojiEventsRounded,
  ScheduleRounded,
  SportsCricketRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CompletedMatchRecord } from "../utils/completedMatches";

interface RecentMatchesModalProps {
  open: boolean;
  onClose: () => void;
  matches: CompletedMatchRecord[];
  onSelectMatch: (id: string) => void;
}

const RecentMatchesModal: React.FC<RecentMatchesModalProps> = ({
  open,
  onClose,
  matches,
  onSelectMatch,
}) => {
  const { t } = useTranslation();
  const formatSavedAt = (iso: string) => {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          width: { xs: "98vw", sm: "100%" },
          maxWidth: { xs: "calc(100vw - 16px)", sm: "none" },
          m: { xs: "8px", sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SportsCricketRounded sx={{ color: "var(--app-accent-text, #185a9d)" }} />
          <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800, fontSize: "calc(22px * var(--app-font-scale, 1))" }}>
            {t("Recent Matches")}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {matches.length === 0 ? (
          <Box
            sx={{
              borderRadius: 2.5,
              border: "1px dashed var(--app-accent-start, #43cea2)",
              background: "rgba(255,255,255,0.75)",
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700 }}>
              {t("No recent matches found.")}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
            {matches.map((match) => {
              const first = match.innings[0];
              const second = match.innings[1];
              return (
                <Box
                  key={match.id}
                  data-ga-click="open_recent_match_scorecard"
                  sx={{
                    border: "1px solid var(--app-accent-start, #43cea2)",
                    borderRadius: 2.8,
                    p: { xs: 1.25, sm: 1.5 },
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(239,250,255,0.94) 100%)",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.2s ease",
                    boxShadow: "0 3px 14px color-mix(in srgb, var(--app-accent-end, #185a9d) 8%, transparent 92%)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 22px color-mix(in srgb, var(--app-accent-end, #185a9d) 17%, transparent 83%)",
                    },
                  }}
                  onClick={() => onSelectMatch(match.id)}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={0.6}
                  >
                    <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 900, fontSize: "calc(18px * var(--app-font-scale, 1))" }}>
                      {match.teams[0]} <span style={{ opacity: 0.7 }}>{t("vs")}</span>{" "}
                      {match.teams[1]}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ScheduleRounded sx={{ fontSize: "calc(16px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)" }} />
                      <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700, fontSize: "calc(12.5px * var(--app-font-scale, 1))" }}>
                        {formatSavedAt(match.savedAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider sx={{ my: 1, borderColor: "rgba(24,90,157,0.14)" }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      rowGap: 0.8,
                    }}
                  >
                    <Chip
                      size="small"
                      label={`${first?.battingTeam}: ${first?.runs}/${first?.wickets} (${first?.overs})`}
                      sx={{
                        maxWidth: "100%",
                        background: "rgba(24,90,157,0.1)",
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 700,
                        border: "1px solid rgba(24,90,157,0.16)",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          display: "block",
                          lineHeight: 1.2,
                          py: 0.5,
                        },
                      }}
                    />
                    <Chip
                      size="small"
                      label={`${second?.battingTeam}: ${second?.runs}/${second?.wickets} (${second?.overs})`}
                      sx={{
                        maxWidth: "100%",
                        background: "rgba(67,206,162,0.15)",
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 700,
                        border: "1px solid rgba(67,206,162,0.28)",
                        "& .MuiChip-label": {
                          whiteSpace: "normal",
                          display: "block",
                          lineHeight: 1.2,
                          py: 0.5,
                        },
                      }}
                    />
                  </Box>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 0.7, sm: 0 }}
                    sx={{ mt: 1.1 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.7}>
                      <EmojiEventsRounded sx={{ color: "#0d8a52", fontSize: "calc(19px * var(--app-font-scale, 1))" }} />
                      <Typography sx={{ color: "#0d8a52", fontWeight: 800, fontSize: "calc(15px * var(--app-font-scale, 1))", overflowWrap: "anywhere" }}>
                        {match.resultText ?? `${t("Winner")}: ${match.winningTeam}`}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700, fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
                        {t("View Scorecard")}
                      </Typography>
                      <ArrowForwardIosRounded sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(14px * var(--app-font-scale, 1))" }} />
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.2 }}>
        <Button
          data-ga-click="close_recent_matches"
          onClick={onClose}
          sx={{
            color: "#fff",
            fontWeight: 700,
            borderRadius: 2,
            px: 2.2,
            background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
            },
          }}
        >
          {t("Close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecentMatchesModal;
