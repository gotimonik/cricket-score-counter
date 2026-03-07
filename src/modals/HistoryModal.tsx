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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
        width: 38,
        height: 38,
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
        boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
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
  const overBowlingTeam = events.find((e) => e.bowlingTeam?.trim())?.bowlingTeam;
  const overBowlerLabel =
    overBowler ||
    (overBowlingTeam
      ? t("{{team}} (team)", { team: overBowlingTeam })
      : t("Team bowling"));
  const totalRuns = events.reduce(
    (acc, e) => acc + (e.type === "run" ? e.value : 0),
    0
  );
  const totalWickets = events.reduce(
    (acc, e) => acc + (e.type === "wicket" ? 1 : 0),
    0
  );
  return (
    <Accordion
      defaultExpanded={isLatest}
      sx={{
        width: "100%",
        mb: 1,
        borderRadius: 2,
        boxShadow: "0 1px 6px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${over}-content`}
        id={`panel-over-${over}-header`}
        sx={{ background: "rgba(67,206,162,0.10)", borderRadius: 2 }}
      >
        <Typography sx={{ fontWeight: 700, color: "var(--app-accent-text, #185a9d)", fontSize: "calc(17px * var(--app-font-scale, 1))" }}>
          {t("Over")} <span style={{ color: "var(--app-accent-start, #43cea2)" }}>{over + 1}</span>{" "}
          &nbsp;|&nbsp; {t("Bowler")}{" "}
          <span style={{ color: "var(--app-accent-text, #185a9d)" }}>{overBowlerLabel}</span>
          {" "}
          &nbsp;|&nbsp; {t("Runs")}{" "}
          <span style={{ color: "var(--app-accent-start, #43cea2)" }}>{totalRuns}</span> &nbsp;|&nbsp;
          {t("Wickets")} <span style={{ color: "#e53935" }}>{totalWickets}</span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, px: 1 }}>
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
  const [infoOpen, setInfoOpen] = React.useState(false);
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
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)',
          boxShadow: '0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)',
          border: '2px solid var(--app-accent-start, #43cea2)',
          backdropFilter: 'blur(8px)',
          maxWidth: 600,
          width: '98vw',
          margin: "8px",
          p: { xs: 2, sm: 4 },
          maxHeight: "calc(100dvh - 24px)",
        },
      }}
    >
      {/* Info Dialog for match history explanation */}
      <Dialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)',
            boxShadow: '0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)',
            border: '2px solid var(--app-accent-start, #43cea2)',
            backdropFilter: 'blur(8px)',
            width: { xs: "98vw", sm: "100%" },
            maxWidth: { xs: "calc(100vw - 16px)", sm: "none" },
            m: { xs: "8px", sm: 2 },
            p: { xs: 2, sm: 3 },
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <strong style={{ fontSize: "calc(18px * var(--app-font-scale, 1))", color: 'var(--app-accent-text, #185a9d)' }}>{t("What is match history?")}</strong>
            <IconButton
              data-ga-click="close_history_info"
              aria-label="close-info"
              onClick={() => setInfoOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
            <li>{t("Match history shows all runs, wickets, and events for each over.")}</li>
            <li>{t("Reviewing history helps teams analyze performance and key moments.")}</li>
            <li>{t("Use this feature to settle disputes or relive exciting plays!")}</li>
          </ul>
        </Box>
      </Dialog>
      <DialogTitle sx={{ fontWeight: 800, color: 'var(--app-accent-text, #185a9d)', fontSize: "calc(22px * var(--app-font-scale, 1))" }}>{t("Match History")}</DialogTitle>
      {resultText ? (
        <Typography sx={{ color: "#0d8a52", fontWeight: 800, fontSize: "calc(16px * var(--app-font-scale, 1))", mb: 1 }}>
          {resultText}
        </Typography>
      ) : null}
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          justifyContent: "center",
          flexWrap: "wrap",
          background: "rgba(255,255,255,0.60)",
          borderRadius: 4,
          minHeight: 98,
          boxShadow: "0 2px 12px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
          position: "relative",
        }}
      >
        <IconButton
          data-ga-click="open_history_info"
          aria-label="info"
          onClick={() => setInfoOpen(true)}
          sx={{
            position: "absolute",
            right: 48,
            top: 12,
            color: "var(--app-accent-text, #185a9d)",
            zIndex: 2,
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
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
            fontWeight: 800,
            fontSize: "calc(26px * var(--app-font-scale, 1))",
            color: "var(--app-accent-text, #185a9d)",
            textAlign: "center",
            pb: 1,
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <span role="img" aria-label="chart" style={{ fontSize: "calc(32px * var(--app-font-scale, 1))" }}>
            📊
          </span>{" "}
          {t("Innings Breakdown")}
        </DialogTitle>
        <Divider
          sx={{ mb: 2, background: "var(--app-accent-start, #43cea2)", height: 3, borderRadius: 2 }}
          data-ga-click="tab_indicator"
        />
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
              color: "var(--app-accent-text, #185a9d)",
              borderRadius: 2,
              px: { xs: 1.2, sm: 3 },
              py: 1,
              transition: "all 0.2s",
              "&.Mui-selected": {
                background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "#fff",
                boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 52%, transparent 48%)",
              },
            },
            "& .MuiTabs-indicator": {
              background: "var(--app-accent-start, #43cea2)",
              height: 4,
              borderRadius: 2,
            },
          }}
        >
          <Tab
            value={teams[0]}
            icon={<LooksOneRounded />}
            label={teams[0]}
            data-ga-click="tab_team_1"
          />
          <Tab
            value={teams[1]}
            icon={<LooksTwoRounded />}
            label={teams[1]}
            data-ga-click="tab_team_2"
          />
        </Tabs>
        <Box sx={{ minHeight: 120, mt: 1 }}>
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
