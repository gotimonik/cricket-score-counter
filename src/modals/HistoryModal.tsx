import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { Box, DialogTitle, Grid, Paper, Tab, Tabs } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BallEvent } from "../types/cricket";
import { LooksOneRounded, LooksTwoRounded } from "@mui/icons-material";

const getRunOptions = ({
  type,
  value,
  extra_type,
}: {
  type: BallEvent["type"];
  value: number;
  extra_type?: string;
}) => {
  let backgroundColor = "#7e7e7e";
  let textColor = "#000000";

  if (type === "run") {
    if (value === 6) {
      backgroundColor = "#008800";
      textColor = "#FFFFFF";
    } else if (value === 4) {
      backgroundColor = "#008800";
      textColor = "#FFFFFF";
    }
  } else if (type === "wicket") {
    backgroundColor = "#FF5733";
    textColor = "#FFFFFF";
  }
  const isExtra = extra_type === "no-ball-extra";
  return (
    <Box
      key={value}
      sx={{
        width: 50,
        height: 50,
        padding: 1,
        textAlign: "center",
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        color: textColor,
        fontWeight: "bold",
        ...(isExtra && {
          fontSize: "small",
        }),
      }}
    >
      {type === "wicket"
        ? isExtra
          ? `NB + W`
          : "W"
        : type === "wide"
        ? "WD"
        : type === "no-ball"
        ? "NB"
        : isExtra
        ? `NB ${value}`
        : value.toString()}
    </Box>
  );
};

const AccordionItems = ({
  team,
  recentEvents,
}: {
  team: string;
  recentEvents: { [key: number]: BallEvent[] };
}) => {
  return (
    <>
      {Object.keys(recentEvents).map((over) => {
        const events = recentEvents[Number(over)];
        const isLatestOver =
          Number(over) === Object.keys(recentEvents).length - 1;
        const totalScoreOfOver = events.reduce(
          (acc, event) => acc + (event.type === "run" ? event.value : 0),
          0
        );
        const totalWicketsOfOver = events.reduce(
          (acc, event) => acc + (event.type === "wicket" ? 1 : 0),
          0
        );
        return (
          <Accordion
            defaultExpanded={isLatestOver}
            key={`${team}-${over}`}
            style={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id={`panel-${team}-${over}-header`}
            >
              <Typography component="span">
                Over: <strong>{Number(over) + 1}</strong> | Runs:{" "}
                <strong>{totalScoreOfOver}</strong> | Wickets:{" "}
                <strong>{totalWicketsOfOver}</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Grid container spacing={2} columns={24}>
                  {events.map((value) => (
                    <Grid>{getRunOptions(value)}</Grid>
                  ))}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
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
          borderRadius: 4,
          background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        },
      }}
    >
      <Paper
        sx={{
          padding: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 0,
          minHeight: 98,
        }}
      >
        <DialogTitle textAlign="center">📊 Innings Breakdown</DialogTitle>
        <Tabs value={value} onChange={handleChange}>
          {team1Events && (
            <Tab value={teams[0]} icon={<LooksOneRounded />} label={teams[0]} />
          )}
          {team2Events && (
            <Tab value={teams[1]} icon={<LooksTwoRounded />} label={teams[1]} />
          )}
        </Tabs>
        {value === teams[0] &&
          team1Events &&
          Object.keys(team1Events).length > 0 && (
            <AccordionItems team="team_1" recentEvents={team1Events} />
          )}
        {value === teams[1] &&
          team2Events &&
          Object.keys(team2Events).length > 0 && (
            <AccordionItems team="team_2" recentEvents={team2Events} />
          )}
      </Paper>
    </Dialog>
  );
}
