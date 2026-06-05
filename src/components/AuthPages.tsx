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
import LockResetRounded from "@mui/icons-material/LockResetRounded";
import LoginRounded from "@mui/icons-material/LoginRounded";
import PersonAddAltRounded from "@mui/icons-material/PersonAddAltRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import AuthService from "../services/AuthService";
import { toCurrentVersionPath } from "../utils/routes";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type AuthMode = "login" | "signup" | "reset";

const authCopy = {
  login: {
    title: "Login",
    subtitle: "Continue to your cricket scoring workspace.",
    action: "Login",
    alternate: "Need an account?",
    alternateAction: "Create one",
    alternatePath: "/signup",
  },
  signup: {
    title: "Sign Up",
    subtitle: "Create an account to keep your match tools ready.",
    action: "Sign Up",
    alternate: "Already have an account?",
    alternateAction: "Login",
    alternatePath: "/login",
  },
  reset: {
    title: "Reset Password",
    subtitle: "Enter your email and choose a new password.",
    action: "Update Password",
    alternate: "Remembered your password?",
    alternateAction: "Login",
    alternatePath: "/login",
  },
};

const AuthPage: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const nextRedirect = (location.state as { next_redirect?: string })
    ?.next_redirect;
  const copy = authCopy[mode];
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const Icon =
    mode === "login"
      ? LoginRounded
      : mode === "signup"
        ? PersonAddAltRounded
        : LockResetRounded;

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" = "info",
  ) => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((currentToast) => ({ ...currentToast, open: false }));
  };

  React.useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      return undefined;
    }

    showToast(t("You are already logged in."), "info");
    const redirectTimer = window.setTimeout(() => {
      navigate(toCurrentVersionPath(location.pathname, "/create-game"), {
        replace: true,
      });
    }, 700);

    return () => window.clearTimeout(redirectTimer);
  }, [location.pathname, navigate, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      showToast(t("Please enter your email."), "error");
      return;
    }
    if (!password) {
      showToast(t("Please enter your password."), "error");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        showToast(t("Please enter your name."), "error");
        return;
      }
    }
    if (mode === "signup" || mode === "reset") {
      if (password.length < 6) {
        showToast(t("Password must be at least 6 characters."), "error");
        return;
      }
      if (password !== confirmPassword) {
        showToast(t("Passwords do not match."), "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await AuthService.login(email.trim(), password);
        showToast(t("Login successful."), "success");
        window.setTimeout(() => {
          navigate(
            toCurrentVersionPath(location.pathname, nextRedirect || "/"),
          );
        }, 700);
      } else if (mode === "signup") {
        await AuthService.signup(name.trim(), email.trim(), password);
        showToast(t("Account created successfully."), "success");
        window.setTimeout(() => {
          navigate(
            toCurrentVersionPath(location.pathname, nextRedirect || "/"),
          );
        }, 700);
      } else {
        await AuthService.resetPassword(email.trim(), password);
        showToast(t("Password reset successful."), "success");
        window.setTimeout(() => {
          navigate(
            toCurrentVersionPath(location.pathname, nextRedirect || "/login"),
          );
        }, 700);
      }
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : t("Something went wrong."),
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <MetaHelmet
        pageTitle={copy.title}
        canonical={location.pathname}
        description={`${copy.title} for Cricket Score Counter.`}
        robots="noindex,follow"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "calc(100dvh - 88px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 3, sm: 5 },
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%) 0%, #f8fffc 100%)",
            border:
              "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 52%, transparent 48%)",
            boxShadow:
              "0 16px 44px color-mix(in srgb, var(--app-accent-end, #185a9d) 24%, transparent 76%)",
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                }}
              >
                <Icon />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "var(--app-accent-text, #185a9d)",
                    fontSize: "calc(24px * var(--app-font-scale, 1))",
                    lineHeight: 1.1,
                  }}
                >
                  {t(copy.title)}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    color: "var(--app-accent-text, #185a9d)",
                    fontWeight: 700,
                    fontSize: "calc(13px * var(--app-font-scale, 1))",
                  }}
                >
                  {t(copy.subtitle)}
                </Typography>
              </Box>
            </Box>

            {mode === "signup" ? (
              <TextField
                label={t("Name")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                autoComplete="name"
              />
            ) : null}
            <TextField
              label={t("Email")}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              autoComplete="email"
            />
            <TextField
              label={mode === "reset" ? t("New Password") : t("Password")}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {mode === "signup" || mode === "reset" ? (
              <TextField
                label={t("Confirm Password")}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                autoComplete="new-password"
                InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              />
            ) : null}

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
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
              {isSubmitting ? t("Please wait...") : t(copy.action)}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {mode === "login" ? (
                <Button
                  onClick={() =>
                    navigate(
                      toCurrentVersionPath(
                        location.pathname,
                        "/reset-password",
                      ),
                    )
                  }
                  sx={{ textTransform: "none", fontWeight: 800 }}
                >
                  {t("Forgot password?")}
                </Button>
              ) : (
                <span />
              )}
              <Button
                onClick={() =>
                  navigate(
                    toCurrentVersionPath(location.pathname, copy.alternatePath),
                  )
                }
                sx={{ textTransform: "none", fontWeight: 800 }}
              >
                {t(copy.alternate)} {t(copy.alternateAction)}
              </Button>
            </Box>
          </Stack>
        </Paper>
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

export const LoginPage = () => <AuthPage mode="login" />;
export const SignupPage = () => <AuthPage mode="signup" />;
export const ResetPasswordPage = () => <AuthPage mode="reset" />;
