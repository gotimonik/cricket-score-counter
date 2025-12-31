import React, { useEffect } from "react";
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
    color = "#185a9d",
    border = "2px solid #43cea2",
    label = value.toString();
  if (type === "run") {
    if (value === 6) {
      bg = "#43cea2";
      color = "#fff";
      label = "6";
    } else if (value === 4) {
      bg = "#43cea2";
      color = "#fff";
      label = "4";
    } else {
      bg = "#e0eafc";
      color = "#185a9d";
      label = value.toString();
    }
  } else if (type === "wicket") {
    bg = "#e53935";
    color = "#fff";
    label = "W";
    if (extra_type === "no-ball-extra") label = "NB+W";
  } else if (type === "wide") {
    bg = "#185a9d";
    color = "#fff";
    label = "WD";
  } else if (type === "no-ball") {
    bg = "#43cea2";
    color = "#fff";
    label = "NB";
  }
  if (extra_type === "no-ball-extra" && type !== "wicket") {
    bg = "#43cea2";
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
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: 0.5,
        my: 0.5,
        boxShadow: "0 1px 4px 0 #185a9d22",
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
}: {
  over: number;
  events: BallEvent[];
  isLatest: boolean;
}) => {
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
        boxShadow: "0 1px 6px 0 #185a9d22",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${over}-content`}
        id={`panel-over-${over}-header`}
        sx={{ background: "rgba(67,206,162,0.10)", borderRadius: 2 }}
      >
        <Typography sx={{ fontWeight: 700, color: "#185a9d", fontSize: 17 }}>
          Over <span style={{ color: "#43cea2" }}>{over + 1}</span>{" "}
          &nbsp;|&nbsp; Runs{" "}
          <span style={{ color: "#43cea2" }}>{totalRuns}</span> &nbsp;|&nbsp;
          Wickets <span style={{ color: "#e53935" }}>{totalWickets}</span>
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
}: {
  open: boolean;
  handleClose: () => void;
  teams: string[];
  recentEventsByTeams: {
    [team: string]: {
      [key: number]: BallEvent[];
    };
  };
}) {
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
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 #43cea255",
          border: "2px solid #43cea2",
          backdropFilter: "blur(8px)",
          maxWidth: 700,
          width: "98vw",
        },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          justifyContent: "center",
          flexWrap: "wrap",
          background: "rgba(255,255,255,0.60)",
          borderRadius: 4,
          minHeight: 98,
          boxShadow: "0 2px 12px 0 #185a9d33",
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#185a9d",
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: 26,
            color: "#185a9d",
            textAlign: "center",
            pb: 1,
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <span role="img" aria-label="chart" style={{ fontSize: 32 }}>
            📊
          </span>{" "}
          Innings Breakdown
        </DialogTitle>
        <Divider
          sx={{ mb: 2, background: "#43cea2", height: 3, borderRadius: 2 }}
        />
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: 18,
              color: "#185a9d",
              borderRadius: 2,
              px: 3,
              py: 1,
              transition: "all 0.2s",
              "&.Mui-selected": {
                background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                color: "#fff",
              },
            },
            "& .MuiTabs-indicator": {
              background: "#43cea2",
              height: 4,
              borderRadius: 2,
            },
          }}
        >
          {team1Events && (
            <Tab value={teams[0]} icon={<LooksOneRounded />} label={teams[0]} />
          )}
          {team2Events && (
            <Tab value={teams[1]} icon={<LooksTwoRounded />} label={teams[1]} />
          )}
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
              />
            ))}
          {value === teams[0] &&
            (!team1Events || Object.keys(team1Events).length === 0) && (
              <Typography
                sx={{
                  color: "#185a9d",
                  fontWeight: 600,
                  textAlign: "center",
                  mt: 3,
                }}
              >
                No events for this team yet.
              </Typography>
            )}
          {value === teams[1] &&
            (!team2Events || Object.keys(team2Events).length === 0) && (
              <Typography
                sx={{
                  color: "#185a9d",
                  fontWeight: 600,
                  textAlign: "center",
                  mt: 3,
                }}
              >
                No events for this team yet.
              </Typography>
            )}
        </Box>
      </Paper>
    </Dialog>
  );
}
