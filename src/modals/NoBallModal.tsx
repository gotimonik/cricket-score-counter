import React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, DialogTitle, Paper } from "@mui/material";
import { noBallScoringOptions } from "../utils/constant";
import { BallEvent } from "../types/cricket";

const getRunOptions = ({
  type,
  value,
}: {
  type: BallEvent["type"];
  value: number;
}) => {
  let backgroundColor = "#7e7e7e";
  let textColor = "#000000";

  if (value === 6) {
    backgroundColor = "#008800";
    textColor = "#FFFFFF";
  } else if (value === 4) {
    backgroundColor = "#008800";
    textColor = "#FFFFFF";
  }

  return (
    <Box
      key={value}
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        color: textColor,
        fontWeight: "bold",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#000000",
          color: "#FFFFFF",
        },
      }}
    >
      {type === "wicket" ? "W" : value.toString()}
    </Box>
  );
};

export default function NoBallModal({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (event: BallEvent) => void;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
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
        <Box>
          <DialogTitle textAlign="center">
            No-Ball: Record Additional Runs
          </DialogTitle>
        </Box>
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          {noBallScoringOptions.map((value) => (
            <Box
              key={`${value.type}-${value.value}`}
              onClick={() => handleSubmit(value)}
            >
              {getRunOptions(value)}
            </Box>
          ))}
        </Box>
      </Paper>
    </Dialog>
  );
}
