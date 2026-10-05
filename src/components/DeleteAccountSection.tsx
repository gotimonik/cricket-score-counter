import React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DeleteForeverRounded from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import { Capacitor } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import AuthService, { DELETE_ACCOUNT_CONFIRMATION } from "../services/AuthService";
import { clearLocalUserData } from "../utils/clearLocalUserData";
import AppSpinner from "./AppSpinner";

const DANGER = "#c62828";
const DANGER_DARK = "#8e1b1b";

/** Everything the backend hard-deletes. Keep in sync with docs/delete-account-api.md. */
export const DELETED_DATA_ITEMS = [
  "Your profile: name, email, phone number and password",
  "Google sign-in link and all active sessions on every device",
  "Saved matches, scorecards and match history",
  "Tournaments you organised, with their teams, fixtures, results and points tables",
  "Saved teams, player lists and player profiles you created",
  "Usage and analytics history linked to your account",
];

interface DeleteAccountSectionProps {
  /** Whether the account has a password (it must be re-entered to confirm). */
  hasPassword: boolean;
  email?: string;
  onDeleted: () => void;
}

const signOutOfNativeGoogle = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
    await GoogleAuth.signOut();
  } catch {
    // Not signed in with Google on this device - nothing to do.
  }
};

const DeleteAccountSection: React.FC<DeleteAccountSectionProps> = ({
  hasPassword,
  email,
  onDeleted,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const [isDeleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Allow deep-linking straight to this section (e.g. from /delete-account).
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#delete-account") {
      document
        .getElementById("delete-account")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const confirmationMatches =
    confirmation.trim().toUpperCase() === DELETE_ACCOUNT_CONFIRMATION;
  const canDelete =
    confirmationMatches && (!hasPassword || password.length > 0) && !isDeleting;

  const close = () => {
    if (isDeleting) return;
    setOpen(false);
    setPassword("");
    setConfirmation("");
    setError("");
  };

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canDelete) return;
    setDeleting(true);
    setError("");
    try {
      await AuthService.deleteAccount({
        password: hasPassword ? password : undefined,
      });
      clearLocalUserData();
      await signOutOfNativeGoogle();
      setOpen(false);
      onDeleted();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : t("We couldn't delete your account. Please try again."),
      );
    } finally {
      setDeleting(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "#fff" },
  };

  return (
    <>
      <Paper
        id="delete-account"
        elevation={0}
        sx={{
          mt: 2.5,
          p: { xs: 1.75, sm: 2.25 },
          borderRadius: 3,
          border: `1.5px solid ${DANGER}55`,
          background: "rgba(255, 244, 244, 0.9)",
          scrollMarginTop: "90px",
        }}
      >
        <Stack spacing={1.25}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteForeverRounded sx={{ color: DANGER }} />
            <Typography
              component="h2"
              sx={{
                fontWeight: 900,
                color: DANGER_DARK,
                fontSize: "calc(16px * var(--app-font-scale, 1))",
              }}
            >
              {t("Delete account")}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: DANGER_DARK,
              fontWeight: 600,
              fontSize: "calc(13px * var(--app-font-scale, 1))",
              lineHeight: 1.6,
            }}
          >
            {t(
              "Permanently delete your account and all data linked to it. This happens immediately and cannot be undone — we can't restore anything afterwards.",
            )}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            startIcon={<DeleteForeverRounded />}
            sx={{
              alignSelf: "flex-start",
              minHeight: 44,
              borderRadius: 2,
              fontWeight: 900,
              textTransform: "none",
              color: DANGER,
              borderColor: DANGER,
              borderWidth: 1.5,
              backgroundColor: "#fff",
              "&:hover": {
                borderColor: DANGER_DARK,
                borderWidth: 1.5,
                backgroundColor: "#fff5f5",
              },
            }}
          >
            {t("Delete my account")}
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          component: "form",
          onSubmit: handleDelete,
          sx: { borderRadius: 3, m: { xs: 1.5, sm: 4 }, width: { xs: "calc(100% - 24px)", sm: undefined } },
        } as object}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 900,
            color: DANGER_DARK,
            pb: 1,
          }}
        >
          <WarningAmberRounded sx={{ color: DANGER }} />
          {t("Delete account permanently?")}
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontWeight: 700, mb: 1, color: "#3a1111", fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
            {email
              ? t("This will permanently delete {{email}} and:", { email })
              : t("This will permanently delete your account and:")}
          </Typography>
          <Box component="ul" sx={{ m: 0, mb: 1.5, pl: 2.5, color: "#3a1111" }}>
            {DELETED_DATA_ITEMS.map((item) => (
              <Typography
                component="li"
                key={item}
                sx={{ fontSize: "calc(13px * var(--app-font-scale, 1))", lineHeight: 1.6 }}
              >
                {t(item)}
              </Typography>
            ))}
          </Box>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 2, fontWeight: 700 }}>
            {t("This can't be undone. Your data is erased from our servers, not hidden.")}
          </Alert>

          <Stack spacing={1.75}>
            {hasPassword ? (
              <TextField
                label={t("Your password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="current-password"
                disabled={isDeleting}
                sx={textFieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label={showPassword ? t("Hide password") : t("Show password")}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}
            <TextField
              label={t("Type {{word}} to confirm", { word: DELETE_ACCOUNT_CONFIRMATION })}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value.toUpperCase())}
              fullWidth
              autoComplete="off"
              disabled={isDeleting}
              inputProps={{ autoCapitalize: "characters", spellCheck: false }}
              sx={textFieldSx}
            />
            {error ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1, flexWrap: "wrap" }}>
          <Button
            onClick={close}
            disabled={isDeleting}
            sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2 }}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!canDelete}
            startIcon={isDeleting ? <AppSpinner size={18} color="inherit" /> : <DeleteForeverRounded />}
            sx={{
              minHeight: 44,
              borderRadius: 2,
              fontWeight: 900,
              textTransform: "none",
              color: "#fff",
              backgroundColor: DANGER,
              "&:hover": { backgroundColor: DANGER_DARK },
              "&.Mui-disabled": { color: "#fff", backgroundColor: `${DANGER}66` },
            }}
          >
            {isDeleting ? t("Deleting…") : t("Delete forever")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccountSection;
