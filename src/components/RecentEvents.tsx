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

    const isExtra = event.extra_type === "no-ball-extra";

    return (
      <Box
        key={index}
        sx={{
          width: 55,
          height: 55,
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
        {event.type === "wicket"
          ? isExtra
            ? `NB + W`
            : "W"
          : event.type === "wide"
          ? "WD"
          : event.type === "no-ball"
          ? "NB"
          : isExtra
          ? `NB + ${event.value}`
          : event.value.toString()}
      </Box>
    );
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        padding: 1,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 0,
        minHeight: 70,
      }}
    >
      {events.map((event, index) => getEventButton(event, index))}
    </Paper>
  );
};

export default RecentEvents;
