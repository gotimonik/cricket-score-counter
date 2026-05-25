import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  DialogTitle,
  Paper,
  Tab,
  Tabs,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { BallEvent } from "../types/cricket";
import { LooksOneRounded, LooksTwoRounded } from "@mui/icons-material";

const getRunBadge = ({ type, value, extra_type }: BallEvent, idx: number) => {
  let bg = "#e0eafc",
    color = "var(--app-accent-text, #185a9d)",
    border = "2px solid var(--app-accent-start, #43cea2)",
    label = value.toString();

  if (type === "run") {
    if (value === 6) {
      bg = "var(--app-accent-start, #43cea2)";
      color = "#fff";
      label = "6";
    } else if (value === 4) {
      bg = "var(--app-accent-start, #43cea2)";
      color = "#fff";
      label = "4";
    } else {
      bg = "#e0eafc";
      color = "var(--app-accent-text, #185a9d)";
      label = value.toString();
    }
  } else if (type === "wicket") {
    bg = "#e53935";
    color = "#fff";
    label = "W";

    if (extra_type === "no-ball-extra") label = "NB+W";
  } else if (type === "wide") {
    bg = "var(--app-accent-text, #185a9d)";
    color = "#fff";
    label = "WD";
  } else if (type === "no-ball") {
    bg = "var(--app-accent-start, #43cea2)";
    color = "#fff";
    label = "NB";
  }

  if (extra_type === "no-ball-extra" && type !== "wicket") {
    bg = "var(--app-accent-start, #43cea2)";
    color = "#fff";
    label = `NB${value}`;
  }

  return (
    <Box
      key={idx}
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: bg,
        color,
        border,
        fontWeight: 700,
        fontSize: "calc(18px * var(--app-font-scale, 1))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: 0.5,
        my: 0.5,
        boxShadow:
          "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
        letterSpacing: 1,
      }}
    >
      {label}
    </Box>
  );
};

const OverAccordion = ({
  over,
  events,
  isLatest,
  t,
}: {
  over: number;
  events: BallEvent[];
  isLatest: boolean;
  t: (key: string, options?: Record<string, any>) => string;
}) => {
  const overBowler = events.find((e) => e.bowler?.trim())?.bowler;

  const overBowlingTeam = events.find((e) =>
    e.bowlingTeam?.trim(),
  )?.bowlingTeam;

  const overBowlerLabel =
    overBowler ||
    (overBowlingTeam
      ? t("{{team}} (team)", { team: overBowlingTeam })
      : t("Team bowling"));

  const totalRuns = events.reduce(
    (acc, e) => acc + (e.type === "run" ? e.value : 0),
    0,
  );

  const totalWickets = events.reduce(
    (acc, e) => acc + (e.type === "wicket" ? 1 : 0),
    0,
  );

  return (
    <Accordion
      defaultExpanded={isLatest}
      sx={{
        width: "100%",
        mb: 1.2,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow:
          "0 4px 14px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 16%, transparent 84%)",
        border:
          "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 32%, transparent 68%)",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${over}-content`}
        id={`panel-over-${over}-header`}
        sx={{
          background:
            "linear-gradient(135deg, rgba(67,206,162,0.12) 0%, rgba(255,255,255,0.78) 100%)",
          p: 2,
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 1.5fr) auto",
            },
            gap: { xs: 0.7, sm: 1.4 },
            alignItems: "center",
            pr: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 900,
                color: "var(--app-accent-text, #185a9d)",
                fontSize: {
                  xs: "calc(17px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
                lineHeight: 1.2,
              }}
            >
              {t("Over")}{" "}
              <Box
                component="span"
                sx={{
                  color: "var(--app-accent-start, #43cea2)",
                }}
              >
                {over + 1}
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                fontWeight: 700,
                color: "var(--app-accent-text, #185a9d)",
                fontSize: {
                  xs: "calc(14px * var(--app-font-scale, 1))",
                  sm: "calc(15px * var(--app-font-scale, 1))",
                },
                lineHeight: 1.35,
                wordBreak: "break-word",
              }}
            >
              {t("Bowler")}: {overBowlerLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.8,
              justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
              },
            }}
          >
            <Box
              sx={{
                px: 1.1,
                py: 0.65,
                borderRadius: 999,
                background: "rgba(67,206,162,0.16)",
                border: "1px solid rgba(67,206,162,0.38)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "var(--app-accent-text, #185a9d)",
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                }}
              >
                {t("Runs")}{" "}
                <Box
                  component="span"
                  sx={{
                    color: "var(--app-accent-start, #43cea2)",
                  }}
                >
                  {totalRuns}
                </Box>
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.1,
                py: 0.65,
                borderRadius: 999,
                background: "rgba(229,57,53,0.08)",
                border: "1px solid rgba(229,57,53,0.22)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "var(--app-accent-text, #185a9d)",
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                }}
              >
                {t("Wickets")}{" "}
                <Box component="span" sx={{ color: "#e53935" }}>
                  {totalWickets}
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: { xs: 1, sm: 1.5 },
          py: 1.2,
          background: "rgba(255,255,255,0.78)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.4,
            px: 0.25,
            justifyContent: "flex-start",
          }}
        >
          {events.map((ev, idx) => getRunBadge(ev, idx))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default function HistoryModal({
  open,
  handleClose,
  teams,
  recentEventsByTeams,
  resultText,
}: {
  open: boolean;
  handleClose: () => void;
  teams: string[];
  recentEventsByTeams: {
    [team: string]: {
      [key: number]: BallEvent[];
    };
  };
  resultText?: string;
}) {
  const { t } = useTranslation();

  const [value, setValue] = React.useState(teams[1] || teams[0]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const team1Events = recentEventsByTeams[teams[0]];
  const team2Events = recentEventsByTeams[teams[1]];

  useEffect(() => {
    if (team2Events && Object.keys(team2Events).length > 0) {
      setValue(teams[1]);
    } else if (team1Events && Object.keys(team1Events).length > 0) {
      setValue(teams[0]);
    }
  }, [team1Events, team2Events, teams]);

  return (
    <Dialog
      open={open}
      disableScrollLock
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 5,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow:
            "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: "94vw",
          width: {
            xs: "94vw",
            md: "50vw",
            sm: "94vw",
          },
          margin: {
            xs: "10px",
            sm: "20px auto",
          },
          p: {
            xs: 1.4,
            sm: 2.5,
          },

          // IMPORTANT
          maxHeight: "calc(100dvh - 20px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <IconButton
        data-ga-click="close_history_modal"
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: "var(--app-accent-text, #185a9d)",
          zIndex: 2,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        sx={{
          fontWeight: 900,
          color: "var(--app-accent-text, #185a9d)",
          fontSize: {
            xs: "calc(24px * var(--app-font-scale, 1))",
            sm: "calc(28px * var(--app-font-scale, 1))",
          },
          px: { xs: 1.2, sm: 1.6 },
          pt: { xs: 0.6, sm: 0.8 },
          pb: 0.6,
          width: "100%",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {t("Match History")}
      </DialogTitle>

      {resultText ? (
        <Typography
          sx={{
            color: "#0d8a52",
            fontWeight: 800,
            fontSize: "calc(16px * var(--app-font-scale, 1))",
            mb: 1,
            width: "100%",
            px: { xs: 1.2, sm: 1.6 },
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          {resultText}
        </Typography>
      ) : null}

      <Paper
        sx={{
          width: "100%",
          maxWidth: "none",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          p: { xs: 1.4, sm: 2.4, md: 3 },
          background: "rgba(255,255,255,0.60)",
          borderRadius: 4,
          boxShadow:
            "0 2px 12px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Divider
          sx={{
            mb: 2,
            background: "var(--app-accent-start, #43cea2)",
            height: 3,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />

        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            width: "100%",
            mb: 2.2,
            minHeight: 56,
            flexShrink: 0,

            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: {
                xs: "calc(13px * var(--app-font-scale, 1))",
                sm: "calc(16px * var(--app-font-scale, 1))",
              },
              color: "var(--app-accent-text, #185a9d)",
              borderRadius: 3,
              minHeight: 48,
              minWidth: {
                xs: 132,
                sm: 170,
              },
              px: {
                xs: 1.4,
                sm: 2.4,
              },
              py: 1.1,
              transition: "all 0.2s",
              gap: 0.5,

              "&.Mui-selected": {
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "#fff",
                boxShadow:
                  "0 2px 8px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 52%, transparent 48%)",
              },
            },

            "& .MuiTabs-indicator": {
              background: "var(--app-accent-start, #43cea2)",
              height: 4,
              borderRadius: 2,
            },

            "& .MuiTabs-flexContainer": {
              gap: {
                xs: 0.8,
                sm: 1.1,
              },
            },
          }}
        >
          <Tab value={teams[0]} icon={<LooksOneRounded />} label={teams[0]} />

          <Tab value={teams[1]} icon={<LooksTwoRounded />} label={teams[1]} />
        </Tabs>

        {/* SCROLLABLE CONTENT */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            pr: 0.5,
          }}
        >
          {value === teams[0] &&
            team1Events &&
            Object.keys(team1Events).length > 0 &&
            Object.keys(team1Events).map((over, idx, arr) => (
              <OverAccordion
                key={`team1-over-${over}`}
                over={Number(over)}
                events={team1Events[Number(over)]}
                isLatest={Number(over) === arr.length - 1}
                t={t}
              />
            ))}

          {value === teams[1] &&
            team2Events &&
            Object.keys(team2Events).length > 0 &&
            Object.keys(team2Events).map((over, idx, arr) => (
              <OverAccordion
                key={`team2-over-${over}`}
                over={Number(over)}
                events={team2Events[Number(over)]}
                isLatest={Number(over) === arr.length - 1}
                t={t}
              />
            ))}

          {value === teams[0] &&
            (!team1Events || Object.keys(team1Events).length === 0) && (
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 600,
                  textAlign: "center",
                  mt: 3,
                }}
              >
                {t("No events for this team yet.")}
              </Typography>
            )}

          {value === teams[1] &&
            (!team2Events || Object.keys(team2Events).length === 0) && (
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 600,
                  textAlign: "center",
                  mt: 3,
                }}
              >
                {t("No events for this team yet.")}
              </Typography>
            )}
        </Box>
      </Paper>
    </Dialog>
  );
}
