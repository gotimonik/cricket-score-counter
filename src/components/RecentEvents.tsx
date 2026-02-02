import type React from "react";
import { Box, Paper } from "@mui/material";
import type { BallEvent } from "../types/cricket";

interface RecentEventsProps {
  events: BallEvent[];
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  const getEventButton = (event: BallEvent, index: number) => {
    let backgroundColor = "#FFFFFF";
    let textColor = "#000000";

    // Compute the label to display
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

    if (event.type === "run") {
      if (event.value === 6) {
        backgroundColor = "#008800";
        textColor = "#FFFFFF";
      } else if (event.value === 4) {
        backgroundColor = "#008800";
        textColor = "#FFFFFF";
      }
    } else if (event.type === "wicket") {
      backgroundColor = "#FF5733";
      textColor = "#FFFFFF";
    }


    // Dynamically set font size based on label length
    let fontSize = "1.2rem";
    if (label.length > 5) fontSize = "0.85rem";
    else if (label.length > 3) fontSize = "1rem";

    return (
      <Box
        key={index}
        p={0}
        sx={{
          width: { xs: 48, md: 60 },
          height: { xs: 48, md: 60 },
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
          fontSize,
        }}
      >
        {label}
      </Box>
    );
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 0,
        minHeight: 50,
      }}
    >
      {events.map((event, index) => getEventButton(event, index))}
    </Paper>
  );
};

export default RecentEvents;
