import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

export interface FeatureGuideStep {
  selector: string;
  title: string;
  description: string;
}

interface FeatureGuideTourProps {
  open: boolean;
  steps: FeatureGuideStep[];
  onClose: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const FeatureGuideTour: React.FC<FeatureGuideTourProps> = ({
  open,
  steps,
  onClose,
}) => {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);

  const getValidIndex = React.useCallback(
    (start: number, direction: 1 | -1 = 1): number => {
      if (!steps.length) return -1;
      for (let i = 0; i < steps.length; i += 1) {
        const idx = clamp(start + i * direction, 0, steps.length - 1);
        const el = document.querySelector(steps[idx].selector);
        if (el) return idx;
      }
      return -1;
    },
    [steps]
  );

  const recalcRect = React.useCallback(() => {
    if (!open || !steps[stepIndex]) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(steps[stepIndex].selector) as HTMLElement | null;
    if (!el) {
      setTargetRect(null);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    setTargetRect(el.getBoundingClientRect());
  }, [open, stepIndex, steps]);

  React.useEffect(() => {
    if (!open) return;
    const first = getValidIndex(0, 1);
    if (first < 0) {
      onClose();
      return;
    }
    setStepIndex(first);
  }, [open, getValidIndex, onClose]);

  React.useEffect(() => {
    if (!open) return;
    recalcRect();
    const handler = () => recalcRect();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open, stepIndex, recalcRect]);

  if (!open || !steps.length || !targetRect) return null;

  const step = steps[stepIndex];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const panelWidth = Math.min(380, vw - 24);
  const preferBottom = targetRect.bottom + 220 < vh;
  const panelTop = preferBottom
    ? targetRect.bottom + 16
    : Math.max(8, targetRect.top - 170);
  const panelLeft = clamp(
    targetRect.left + targetRect.width / 2 - panelWidth / 2,
    8,
    vw - panelWidth - 8
  );
  const arrowLeft = clamp(
    targetRect.left + targetRect.width / 2 - panelLeft - 8,
    14,
    panelWidth - 22
  );

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1700,
        pointerEvents: "auto",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.5)",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: Math.max(4, targetRect.top - 6),
          left: Math.max(4, targetRect.left - 6),
          width: targetRect.width + 12,
          height: targetRect.height + 12,
          borderRadius: 2,
          border: "2px solid var(--app-accent-start, #43cea2)",
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
          pointerEvents: "none",
        }}
      />
      <Paper
        elevation={12}
        sx={{
          position: "fixed",
          top: panelTop,
          left: panelLeft,
          width: panelWidth,
          p: 1.4,
          borderRadius: 2,
          border: "1.5px solid var(--app-accent-start, #43cea2)",
          bgcolor: "rgba(255,255,255,0.98)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: arrowLeft,
            top: preferBottom ? -8 : "auto",
            bottom: preferBottom ? "auto" : -8,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: preferBottom
              ? "8px solid #fff"
              : "none",
            borderTop: preferBottom
              ? "none"
              : "8px solid #fff",
          }}
        />
        <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)" }}>
          {step.title}
        </Typography>
        <Typography sx={{ mt: 0.5, color: "var(--app-accent-text, #185a9d)" }}>
          {step.description}
        </Typography>
        <Typography sx={{ mt: 0.6, fontSize: 12, opacity: 0.8 }}>
          {stepIndex + 1} / {steps.length}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            size="small"
            onClick={onClose}
            sx={{ textTransform: "none", color: "var(--app-accent-text, #185a9d)" }}
          >
            Skip
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              disabled={stepIndex === 0}
              onClick={() => {
                const prev = getValidIndex(stepIndex - 1, -1);
                if (prev >= 0) setStepIndex(prev);
              }}
              sx={{ textTransform: "none" }}
            >
              Back
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                const next = getValidIndex(stepIndex + 1, 1);
                if (next < 0 || stepIndex >= steps.length - 1) {
                  onClose();
                  return;
                }
                setStepIndex(next);
              }}
              sx={{
                textTransform: "none",
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              }}
            >
              {stepIndex === steps.length - 1 ? "Done" : "Next"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FeatureGuideTour;
