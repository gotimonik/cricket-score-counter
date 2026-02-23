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
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          border: "2px solid #43cea2",
        },
      }}
    >
      <DialogTitle sx={{ color: "#185a9d", fontWeight: 800 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SportsCricketRounded sx={{ color: "#185a9d" }} />
          <Typography sx={{ color: "#185a9d", fontWeight: 800, fontSize: 22 }}>
            {t("Recent Matches")}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {matches.length === 0 ? (
          <Box
            sx={{
              borderRadius: 2.5,
              border: "1px dashed #43cea2",
              background: "rgba(255,255,255,0.75)",
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#185a9d", fontWeight: 700 }}>
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
                  sx={{
                    border: "1px solid #43cea2",
                    borderRadius: 2.8,
                    p: { xs: 1.25, sm: 1.5 },
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(239,250,255,0.94) 100%)",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.2s ease",
                    boxShadow: "0 3px 14px #185a9d14",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 22px #185a9d2b",
                    },
                  }}
                  onClick={() => onSelectMatch(match.id)}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography sx={{ color: "#185a9d", fontWeight: 900, fontSize: 18 }}>
                      {match.teams[0]} <span style={{ opacity: 0.7 }}>{t("vs")}</span>{" "}
                      {match.teams[1]}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ScheduleRounded sx={{ fontSize: 16, color: "#185a9d" }} />
                      <Typography sx={{ color: "#185a9d", fontWeight: 700, fontSize: 12.5 }}>
                        {formatSavedAt(match.savedAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider sx={{ my: 1, borderColor: "rgba(24,90,157,0.14)" }} />

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 0.8 }}>
                    <Chip
                      size="small"
                      label={`${first?.battingTeam}: ${first?.runs}/${first?.wickets} (${first?.overs})`}
                      sx={{
                        background: "rgba(24,90,157,0.1)",
                        color: "#185a9d",
                        fontWeight: 700,
                        border: "1px solid rgba(24,90,157,0.16)",
                      }}
                    />
                    <Chip
                      size="small"
                      label={`${second?.battingTeam}: ${second?.runs}/${second?.wickets} (${second?.overs})`}
                      sx={{
                        background: "rgba(67,206,162,0.15)",
                        color: "#185a9d",
                        fontWeight: 700,
                        border: "1px solid rgba(67,206,162,0.28)",
                      }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 1.1 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.7}>
                      <EmojiEventsRounded sx={{ color: "#0d8a52", fontSize: 19 }} />
                      <Typography sx={{ color: "#0d8a52", fontWeight: 800, fontSize: 15 }}>
                        {match.resultText ?? `${t("Winner")}: ${match.winningTeam}`}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography sx={{ color: "#185a9d", fontWeight: 700, fontSize: 13 }}>
                        {t("View Scorecard")}
                      </Typography>
                      <ArrowForwardIosRounded sx={{ color: "#185a9d", fontSize: 14 }} />
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
          onClick={onClose}
          sx={{
            color: "#fff",
            fontWeight: 700,
            borderRadius: 2,
            px: 2.2,
            background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
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
