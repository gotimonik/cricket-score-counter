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
import GavelIcon from "@mui/icons-material/Gavel";
import ParkIcon from "@mui/icons-material/Park";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

const getEventTotalRuns = (event: BallEvent) =>
  event.extra_type === "no-ball-extra" ? event.value + 1 : event.value;

const getWicketIcon = (event: BallEvent) => {
  const sx = { fontSize: { xs: 17, sm: 19, md: 21 } };
  if (event.wicketType === "caught") return <SportsBaseballIcon sx={sx} />;
  if (event.wicketType === "lbw") return <GavelIcon sx={sx} />;
  if (event.wicketType === "run-out") return <PersonOffIcon sx={sx} />;
  return <SportsCricketIcon sx={sx} />;
};

const getRunBadge = (event: BallEvent, idx: number) => {
  let background = "#FFFFFF";
  let color = "#000000";
  let content: React.ReactNode;

  let label = "";
  if (event.type === "wicket") {
    if (event.extra_type === "no-ball-extra") {
      label = "NB + W";
    } else if (event.value > 0) {
      label = `W + ${event.value}`;
    } else {
      label = "W";
    }
  } else if (event.type === "wide") {
    label = event.value > 1 ? `WD + ${event.value - 1}` : "WD";
  } else if (event.type === "no-ball") {
    label = "NB";
  } else if (event.extra_type === "no-ball-extra") {
    label = `NB + ${event.value}`;
  } else {
    label = event.value.toString();
  }
  content = label;

  if (event.type === "wide") {
    background = "linear-gradient(120deg, #fde047 0%, #facc15 100%)";
    color = "#1f2933";
  } else if (event.type === "no-ball" || event.extra_type === "no-ball-extra") {
    background = "#2876b8";
    color = "#FFFFFF";
  } else if (event.type === "run") {
    if (event.value === 0) {
      background = "linear-gradient(120deg, #2f7d4d 0%, #1f6539 100%)";
      color = "#FFFFFF";
      content = <ParkIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
    } else if (event.value === 6) {
      background = "#9536cf";
      color = "#FFFFFF";
    } else if (event.value === 4) {
      background = "#2876b8";
      color = "#FFFFFF";
    } else if (event.value > 0) {
      background = "#eef0f3";
      color = "#1f2933";
    }
  } else if (event.type === "wicket") {
    background = "#e4003f";
    color = "#FFFFFF";
    content = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.1,
        }}
      >
        {getWicketIcon(event)}
        {event.value > 0 ? (
          <Box sx={{ fontSize: "0.58rem", lineHeight: 0.9 }}>
            +{event.value}
          </Box>
        ) : null}
      </Box>
    );
  }

  let fontSize = "0.95rem";
  if (label.length > 5) fontSize = "0.68rem";
  else if (label.length > 3) fontSize = "0.78rem";

  return (
    <Box
      key={idx}
      sx={{
        width: { xs: 34, sm: 38, md: 42 },
        height: { xs: 34, sm: 38, md: 42 },
        p: 0.45,
        borderRadius: "50%",
        background,
        color,
        fontWeight: "bold",
        fontSize,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        m: { xs: 0.35, sm: 0.45 },
        textAlign: "center",
      }}
    >
      {content}
    </Box>
  );
};

const OverAccordion = ({
  over,
  events,
  inningsRuns,
  inningsWickets,
  isLatest,
  t,
}: {
  over: number;
  events: BallEvent[];
  inningsRuns: number;
  inningsWickets: number;
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

  const totalRuns = events.reduce((acc, e) => acc + getEventTotalRuns(e), 0);

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
                {t("Over")}{" "}
                <Box
                  component="span"
                  sx={{
                    color: "var(--app-accent-start, #43cea2)",
                  }}
                >
                  {totalRuns}/{totalWickets}
                </Box>
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.1,
                py: 0.65,
                borderRadius: 999,
                background: "rgba(40,118,184,0.1)",
                border: "1px solid rgba(40,118,184,0.24)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "var(--app-accent-text, #185a9d)",
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                }}
              >
                {t("Score")}{" "}
                <Box component="span" sx={{ color: "#2876b8" }}>
                  {inningsRuns}/{inningsWickets}
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
  const team1Overs = Object.keys(team1Events ?? {})
    .map(Number)
    .sort((a, b) => a - b);
  const team2Overs = Object.keys(team2Events ?? {})
    .map(Number)
    .sort((a, b) => a - b);
  const buildOverRows = (
    eventsByOver: { [key: number]: BallEvent[] } | undefined,
    overs: number[],
  ) => {
    let inningsRuns = 0;
    let inningsWickets = 0;
    return overs.map((over) => {
      const events = eventsByOver?.[over] ?? [];
      inningsRuns += events.reduce((acc, event) => acc + getEventTotalRuns(event), 0);
      inningsWickets += events.reduce(
        (acc, event) => acc + (event.type === "wicket" ? 1 : 0),
        0,
      );
      return {
        over,
        events,
        inningsRuns,
        inningsWickets,
      };
    });
  };
  const team1Rows = buildOverRows(team1Events, team1Overs);
  const team2Rows = buildOverRows(team2Events, team2Overs);

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
          height: "calc(100dvh - 20px)",
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
            maxHeight: {
              xs: "calc(100dvh - 238px)",
              sm: "calc(100dvh - 280px)",
            },
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            pr: 0.7,
            scrollbarGutter: "stable",
          }}
        >
          {value === teams[0] &&
            team1Rows.length > 0 &&
            team1Rows.map((row, idx, arr) => (
              <OverAccordion
                key={`team1-over-${row.over}`}
                over={row.over}
                events={row.events}
                inningsRuns={row.inningsRuns}
                inningsWickets={row.inningsWickets}
                isLatest={row.over === arr[arr.length - 1].over}
                t={t}
              />
            ))}

          {value === teams[1] &&
            team2Rows.length > 0 &&
            team2Rows.map((row, idx, arr) => (
              <OverAccordion
                key={`team2-over-${row.over}`}
                over={row.over}
                events={row.events}
                inningsRuns={row.inningsRuns}
                inningsWickets={row.inningsWickets}
                isLatest={row.over === arr[arr.length - 1].over}
                t={t}
              />
            ))}

          {value === teams[0] &&
            team1Overs.length === 0 && (
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
            team2Overs.length === 0 && (
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
