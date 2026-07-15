import React from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockRounded from "@mui/icons-material/LockRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";

type AuthUser = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  hasPassword?: boolean;
};

const AccountSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [authUser, setAuthUser] = React.useState<AuthUser | null>(() =>
    AuthService.getUser(),
  );
  const [isCheckingSession, setCheckingSession] = React.useState(true);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" = "info",
  ) => setToast({ open: true, message, severity });

  const closeToast = () =>
    setToast((current) => ({ ...current, open: false }));

  React.useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate("/login", { state: { next_redirect: location.pathname } });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const refreshedUser = await AuthService.refreshCurrentUser();
        if (!cancelled && refreshedUser) {
          setAuthUser(refreshedUser as AuthUser);
        }
      } catch (err) {
        // Fall back silently to whatever is already cached locally.
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasPassword = Boolean(authUser?.hasPassword);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (hasPassword && !currentPassword) {
      showToast(t("Please enter your current password."), "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast(t("Password must be at least 6 characters."), "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t("Passwords do not match."), "error");
      return;
    }

    setSubmitting(true);
    try {
      const data = await AuthService.setPassword(
        newPassword,
        hasPassword ? currentPassword : undefined,
      );
      setAuthUser((data.user as AuthUser) || { ...authUser, hasPassword: true });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast(
        hasPassword
          ? t("Password updated successfully.")
          : t("Password added. You can now log in with email and password too."),
        "success",
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : t("Something went wrong."),
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      minHeight: 54,
    },
  };

  return (
    <>
      <MetaHelmet
        pageTitle={t("Account Settings")}
        canonical={location.pathname}
        description={t(
          "Manage your Cricket Score Counter account, including adding or changing your password.",
        )}
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 620, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3 },
            }}
          >
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(26px * var(--app-font-scale, 1))",
                  sm: "calc(34px * var(--app-font-scale, 1))",
                },
              }}
            >
              {t("Account Settings")}
            </PageTitleWithBack>

            <Stack spacing={0.5} sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 800,
                  fontSize: "calc(16px * var(--app-font-scale, 1))",
                }}
              >
                {authUser?.name || t("Your account")}
              </Typography>
              {authUser?.email ? (
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    opacity: 0.75,
                    fontWeight: 600,
                    fontSize: "calc(13px * var(--app-font-scale, 1))",
                  }}
                >
                  {authUser.email}
                </Typography>
              ) : null}
            </Stack>

            {!authUser?.email ? (
              <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                {t(
                  "Sign in with Google to link an email before you can set a password.",
                )}
              </Alert>
            ) : (
              <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={0}
                sx={{
                  p: { xs: 1.75, sm: 2.25 },
                  borderRadius: 3,
                  border:
                    "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                  background: "rgba(255,255,255,0.76)",
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockRounded sx={{ color: "var(--app-accent-text, #185a9d)" }} />
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: "var(--app-accent-text, #185a9d)",
                        fontSize: "calc(16px * var(--app-font-scale, 1))",
                      }}
                    >
                      {hasPassword
                        ? t("Change your password")
                        : t("Add a password")}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: "var(--app-accent-text, #185a9d)",
                      opacity: 0.85,
                      fontWeight: 600,
                      fontSize: "calc(13px * var(--app-font-scale, 1))",
                    }}
                  >
                    {hasPassword
                      ? t(
                          "Update the password used to log in with your email.",
                        )
                      : t(
                          "This account currently signs in with Google only. Add a password to also log in with your email.",
                        )}
                  </Typography>

                  {hasPassword ? (
                    <TextField
                      label={t("Current Password")}
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      fullWidth
                      autoComplete="current-password"
                      sx={textFieldSx}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() =>
                                setShowCurrentPassword((prev) => !prev)
                              }
                            >
                              {showCurrentPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : null}

                  <TextField
                    label={t("New Password")}
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    fullWidth
                    autoComplete="new-password"
                    sx={textFieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowNewPassword((prev) => !prev)
                            }
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label={t("Confirm New Password")}
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    fullWidth
                    autoComplete="new-password"
                    sx={textFieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || isCheckingSession}
                    sx={{
                      minHeight: 46,
                      borderRadius: 2,
                      fontWeight: 900,
                      textTransform: "none",
                      color: "#fff",
                      background:
                        "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                      "&:hover, &:active, &:focus, &.Mui-focusVisible": {
                        color: "#fff",
                        background:
                          "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                      },
                    }}
                  >
                    {isSubmitting
                      ? t("Please wait...")
                      : hasPassword
                        ? t("Update Password")
                        : t("Set Password")}
                  </Button>
                </Stack>
              </Paper>
            )}
          </Paper>
        </Box>
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={3200}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", fontWeight: 800 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AccountSettingsPage;
