import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import { useTranslation } from "react-i18next";

export type ChangeBowlerScope = "whole-over" | "from-next-ball";

interface ChangeBowlerModalProps {
  open: boolean;
  currentBowler: string;
  /** Everyone in the fielding side. */
  bowlers: string[];
  /** Bowled the previous over, so can't bowl this one (no consecutive overs). */
  previousOverBowler: string;
  /** Legal balls already bowled in this over. */
  ballsThisOver: number;
  onConfirm: (value: { bowler: string; scope: ChangeBowlerScope }) => void;
  onClose: () => void;
}

const sectionSx = {
  p: 1.4,
  borderRadius: 2,
  border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 46%, transparent 54%)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
} as const;

const choiceSx = (selected: boolean) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: 2,
  minHeight: 44,
  px: 1.2,
  fontWeight: 800,
  textAlign: "left",
  color: selected ? "#fff" : "var(--app-accent-text, #185a9d)",
  borderColor: "color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
  background: selected
    ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
    : "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #fff 90%)",
});

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 900, mb: 1 }}>{children}</Typography>
);

/**
 * Change the bowler during an innings. Before the first ball of an over it's
 * a plain pick. Mid-over the scorer says whether the wrong bowler was picked
 * for this over (the over's balls move to the right bowler) or whether the
 * bowler can't finish it (another bowler takes over from the next ball).
 */
const ChangeBowlerModal: React.FC<ChangeBowlerModalProps> = ({
  open,
  currentBowler,
  bowlers,
  previousOverBowler,
  ballsThisOver,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const [bowler, setBowler] = useState(currentBowler);
  const [scope, setScope] = useState<ChangeBowlerScope | "">("");

  useEffect(() => {
    if (!open) return;
    setBowler(currentBowler);
    setScope("");
  }, [open, currentBowler]);

  const midOver = ballsThisOver > 0;
  const changed = Boolean(bowler) && bowler !== currentBowler;
  const valid = changed && bowler !== previousOverBowler && (!midOver || Boolean(scope));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      disableScrollLock
      sx={{ "& .MuiDialog-paper": { borderRadius: 4, m: { xs: "8px", sm: 2 }, maxHeight: "calc(100dvh - 16px)" } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "var(--app-accent-text, #185a9d)", fontWeight: 800, pb: 1 }}>
        <SportsBaseballIcon />
        {t("Change bowler")}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        <Box sx={sectionSx}>
          <Title>{t("Who is bowling?")}</Title>
          <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 0.8 }}>
            {bowlers.map((name) => {
              const selected = bowler === name;
              const blocked = name === previousOverBowler && name !== currentBowler;
              return (
                <Button
                  key={name}
                  variant={selected ? "contained" : "outlined"}
                  disabled={blocked}
                  startIcon={selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                  onClick={() => setBowler(name)}
                  sx={choiceSx(selected)}
                >
                  <Box component="span" sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    <span>{name}</span>
                    {(blocked || name === currentBowler) && (
                      <Box component="span" sx={{ fontSize: "calc(11px * var(--app-font-scale, 1))", fontWeight: 700, opacity: 0.8 }}>
                        {name === currentBowler ? t("Bowling now") : t("Bowled last over")}
                      </Box>
                    )}
                  </Box>
                </Button>
              );
            })}
          </Box>
        </Box>

        {midOver && changed && (
          <Box sx={sectionSx}>
            <Title>{t("What happened?")}</Title>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              {([
                {
                  value: "whole-over",
                  title: t("The wrong bowler was picked for this over"),
                  body: t("Fix this over: its {{count}} balls, runs and wickets move to {{name}}.", { count: ballsThisOver, name: bowler }),
                },
                {
                  value: "from-next-ball",
                  title: t("{{name}} can't finish the over", { name: currentBowler }),
                  body: t("Injured or taken off: {{name}} bowls the rest of the over, and the balls so far stay with {{current}}.", {
                    name: bowler,
                    current: currentBowler,
                  }),
                },
              ] as const).map((option) => {
                const selected = scope === option.value;
                return (
                  <Button
                    key={option.value}
                    variant={selected ? "contained" : "outlined"}
                    startIcon={selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => setScope(option.value)}
                    sx={{ ...choiceSx(selected), alignItems: "flex-start", py: 1 }}
                  >
                    <Box component="span" sx={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                      <span>{option.title}</span>
                      <Box component="span" sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", fontWeight: 600, opacity: 0.85, mt: 0.25 }}>
                        {option.body}
                      </Box>
                    </Box>
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}

        {previousOverBowler && (
          <Typography sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", color: "#526274", fontWeight: 600, px: 0.5 }}>
            {t("{{name}} bowled the last over, so can't bowl this one.", { name: previousOverBowler })}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", fontWeight: 800 }}>
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={!valid}
          data-ga-click="confirm_change_bowler"
          onClick={() => onConfirm({ bowler, scope: midOver && scope ? scope : "from-next-ball" })}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2,
            background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
          }}
        >
          {t("Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeBowlerModal;
