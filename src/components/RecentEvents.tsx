import type React from "react";
import { Box, Paper, Typography } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import ParkIcon from "@mui/icons-material/Park";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import type { BallEvent } from "../types/cricket";

interface RecentEventsProps {
  events: BallEvent[];
  statusMessage?: string;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events, statusMessage }) => {
  const getWicketIcon = (event: BallEvent) => {
    const sx = { fontSize: { xs: 17, sm: 19, md: 21 } };
    if (event.wicketType === "caught") return <SportsBaseballIcon sx={sx} />;
    if (event.wicketType === "lbw") return <GavelIcon sx={sx} />;
    if (event.wicketType === "run-out") return <PersonOffIcon sx={sx} />;
    return <SportsCricketIcon sx={sx} />;
  };

  const getEventButton = (event: BallEvent, index: number) => {
    let backgroundColor = "#FFFFFF";
    let textColor = "#000000";
    let content: React.ReactNode;

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
    content = label;

    if (event.type === "wide") {
      backgroundColor = "#eef0f3";
      textColor = "#1f2933";
    } else if (event.type === "no-ball" || event.extra_type === "no-ball-extra") {
      backgroundColor = "#2876b8";
      textColor = "#FFFFFF";
    } else if (event.type === "run") {
      if (event.value === 0) {
        backgroundColor = "#eef0f3";
        textColor = "#1f2933";
        content = <ParkIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
      } else if (event.value === 6) {
        backgroundColor = "#9536cf";
        textColor = "#FFFFFF";
      } else if (event.value === 4) {
        backgroundColor = "#2876b8";
        textColor = "#FFFFFF";
      } else if (event.value > 0) {
        backgroundColor = "#eef0f3";
        textColor = "#1f2933";
      }
    } else if (event.type === "wicket") {
      backgroundColor = "#e4003f";
      textColor = "#FFFFFF";
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


    // Dynamically set font size based on label length
    let fontSize = "0.95rem";
    if (label.length > 5) fontSize = "0.68rem";
    else if (label.length > 3) fontSize = "0.78rem";

    return (
      <Box
        key={index}
        p={0}
        sx={{
          width: { xs: 34, sm: 38, md: 42 },
          height: { xs: 34, sm: 38, md: 42 },
          padding: 0.45,
          textAlign: "center",
          borderRadius: "50%",
          backgroundColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: { xs: 0.35, sm: 0.45 },
          color: textColor,
          fontWeight: "bold",
          fontSize,
          lineHeight: 1,
        }}
      >
        {content}
      </Box>
    );
  };

  if (events.length === 0 && !statusMessage) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 0.4, sm: 0.55 },
        display: "inline-flex",
        justifyContent: "center",
        flexWrap: "wrap",
        backgroundColor: "rgba(255, 255, 255, 0.35)",
        border:
          "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 70%, transparent 30%)",
        borderRadius: 2.5,
        minHeight: { xs: 38, sm: 42 },
        width: "fit-content",
        maxWidth: "100%",
        minWidth: statusMessage ? { xs: 240, sm: 320 } : undefined,
      }}
    >
      {statusMessage ? (
        <Typography
          sx={{
            px: 2,
            py: 1.2,
            textAlign: "center",
            fontWeight: 900,
            color: "#ffffff",
            fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
            letterSpacing: 0.15,
            lineHeight: 1.35,
            textShadow: "0 1px 10px rgba(6, 20, 43, 0.4)",
          }}
        >
          {statusMessage}
        </Typography>
      ) : (
        events.map((event, index) => getEventButton(event, index))
      )}
    </Paper>
  );
};

export default RecentEvents;
