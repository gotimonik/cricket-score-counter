import React from "react";
import { Box, Button, type ButtonProps } from "@mui/material";
import { IosShareRounded } from "@mui/icons-material";
import { BOARD } from "../../utils/brand";

/**
 * The app's signature Share button: a gold-leaf pill with the share icon in
 * a board-green badge. A soft shimmer passes over it every few seconds, and
 * the arrow lifts on hover as if the link is on its way. Sized for dark
 * board-green headers (tournament page, player card).
 */
const ShareButton: React.FC<Omit<ButtonProps, "startIcon" | "variant">> = ({ children = "Share", sx, ...rest }) => (
  <Button
    {...rest}
    startIcon={
      <Box
        component="span"
        className="share-badge"
        sx={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          color: BOARD.goldLight,
          background: `linear-gradient(160deg, #1a4638 0%, ${BOARD.green} 60%, ${BOARD.greenDeep} 100%)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.35)",
          "& svg": { fontSize: 16, transition: "transform 220ms cubic-bezier(.3,1.6,.5,1)" },
        }}
      >
        <IosShareRounded />
      </Box>
    }
    sx={[
      {
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        textTransform: "none",
        fontWeight: 900,
        letterSpacing: 0.2,
        fontSize: "calc(14px * var(--app-font-scale, 1))",
        color: "#2a1f05",
        borderRadius: 99,
        minHeight: 38,
        pl: 0.6,
        pr: 2,
        py: 0.5,
        border: "1px solid rgba(255,240,200,0.65)",
        background: `linear-gradient(180deg, #F8E4A6 0%, ${BOARD.goldLight} 30%, ${BOARD.gold} 100%)`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 0 rgba(120,85,10,0.25), 0 4px 14px rgba(217,180,90,0.35), 0 0 0 3px rgba(217,180,90,0.12)",
        transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease",
        "& .MuiButton-startIcon": { ml: 0, mr: 1 },
        // Shimmer that sweeps across every few seconds.
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.75) 48%, transparent 66%)",
          transform: "translateX(-130%)",
          animation: "shareShimmer 4.5s ease-in-out infinite",
          pointerEvents: "none",
        },
        "@keyframes shareShimmer": {
          "0%, 62%": { transform: "translateX(-130%)" },
          "82%, 100%": { transform: "translateX(130%)" },
        },
        "&:hover": {
          background: `linear-gradient(180deg, #FCEBB8 0%, #F5DD98 35%, ${BOARD.gold} 100%)`,
          transform: "translateY(-2px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(120,85,10,0.25), 0 8px 22px rgba(217,180,90,0.5), 0 0 0 4px rgba(217,180,90,0.18)",
        },
        "&:hover .share-badge svg, &:focus-visible .share-badge svg": { transform: "translateY(-3px)" },
        "&:active": { transform: "translateY(0)", filter: "brightness(0.96)" },
        "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 3 },
        "&.Mui-disabled": { color: "rgba(42,31,5,0.5)", filter: "grayscale(0.4)", opacity: 0.7 },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&::after": { animation: "none", display: "none" },
          "& .share-badge svg": { transition: "none" },
        },
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {children}
  </Button>
);

export default ShareButton;
