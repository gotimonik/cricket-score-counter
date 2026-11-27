import React from "react";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlined from "@mui/icons-material/LockOutlined";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import SportsCricketRounded from "@mui/icons-material/SportsCricketRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import InsightsRounded from "@mui/icons-material/InsightsRounded";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import PhoneIphoneRounded from "@mui/icons-material/PhoneIphoneRounded";
import SmsRounded from "@mui/icons-material/SmsRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import { IS_IOS_APP } from "../utils/platform";
import { ROLE_DESTINATION, type JoinRole } from "../utils/playerOnboarding";
import {
  AppleSignInCancelled,
  signInWithAppleNative,
} from "../utils/appleSignIn";
import AuthService, {
  ACCOUNT_NOT_FOUND,
  ApiError,
  EMAIL_NOT_VERIFIED,
} from "../services/AuthService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type AuthMode = "login" | "signup" | "reset";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number | boolean>,
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";

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
    subtitle: "Enter your email and we'll send you a code to reset your password.",
    action: "Send code",
    alternate: "Remembered your password?",
    alternateAction: "Login",
    alternatePath: "/login",
  },
};

const AuthPage: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = location.state as
    | { next_redirect?: string; join_role?: JoinRole }
    | null;
  // "Joining as" on sign-up decides where people land: players go straight
  // to creating their player profile, organizers to tournaments. It's always
  // shown on sign-up, pre-selected when they came from a "Sign up as a
  // player/organizer" button, and can be changed. A redirect from a page
  // that needed a login (no role attached) still wins.
  const [joinRole, setJoinRole] = React.useState<JoinRole | null>(
    authState?.join_role ?? null,
  );
  const nextRedirect = authState?.join_role
    ? joinRole
      ? ROLE_DESTINATION[joinRole]
      : authState.next_redirect
    : authState?.next_redirect ??
      (joinRole ? ROLE_DESTINATION[joinRole] : undefined);
  const copy = authCopy[mode];
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [mobileOtp, setMobileOtp] = React.useState("");
  const [isMobileOtpSent, setMobileOtpSent] = React.useState(false);
  const [isMobileSubmitting, setMobileSubmitting] = React.useState(false);
  // "code": waiting for the 6-digit code we emailed (verify email on
  // signup/login, or the password reset code).
  const [step, setStep] = React.useState<"form" | "code">("form");
  const [emailCode, setEmailCode] = React.useState("");
  const [resendIn, setResendIn] = React.useState(0);
  const [isResending, setResending] = React.useState(false);
  const isCodeStep = step === "code";
  // Login page: the Google account isn't registered, so offer Sign Up
  // instead of silently creating an account.
  const [googleNoAccount, setGoogleNoAccount] = React.useState(false);
  // Same for Sign in with Apple (iOS app only).
  const [appleNoAccount, setAppleNoAccount] = React.useState(false);
  const [isAppleLoading, setAppleLoading] = React.useState(false);
  // Mobile login is shown only once the backend confirms it can send SMS.
  const [isMobileLoginEnabled, setMobileLoginEnabled] = React.useState(false);
  // The mobile-number option is tucked behind a link so the form fits on one screen.
  const [showMobileOption, setShowMobileOption] = React.useState(false);
  const [mobileResendIn, setMobileResendIn] = React.useState(0);
  const [mobileNoAccount, setMobileNoAccount] = React.useState(false);
  const googleIntent: "login" | "signup" = mode === "signup" ? "signup" : "login";
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [isGoogleLoading, setGoogleLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);
  const nativeGoogleInitializedRef = React.useRef(false);
  // Google blocks its web sign-in button inside app web views (iOS showed
  // "Access blocked: Authorization Error / Error 400: invalid_request"), so
  // both native apps use the native Google Sign-In SDK via the plugin.
  const nativePlatform = Capacitor.getPlatform();
  const isNativeGoogleLogin =
    nativePlatform === "android" || nativePlatform === "ios";
  // iOS needs its own OAuth client ID; if a build is missing it, hide the
  // Google button rather than show a setup error to App Review.
  const isGoogleConfigured = Boolean(
    (process.env.REACT_APP_GOOGLE_CLIENT_ID || "").trim() &&
      (!IS_IOS_APP || (process.env.REACT_APP_GOOGLE_IOS_CLIENT_ID || "").trim()),
  );
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" = "info",
  ) => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((currentToast) => ({ ...currentToast, open: false }));
  };

  const navigateAfterAuth = React.useCallback(
    (fallback = "/") => {
      window.setTimeout(() => {
        navigate(nextRedirect || fallback, { replace: true });
      }, 700);
    },
    [navigate, nextRedirect],
  );

  React.useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      return undefined;
    }

    showToast(t("You are already logged in."), "info");
    const redirectTimer = window.setTimeout(() => {
      navigate(nextRedirect || "/create-game", {
        replace: true,
      });
    }, 700);

    return () => window.clearTimeout(redirectTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate, t]);

  React.useEffect(() => {
    if (mode === "reset") return undefined;
    if (isNativeGoogleLogin) return undefined;
    const clientId = (process.env.REACT_APP_GOOGLE_CLIENT_ID || "").trim();
    if (!clientId || !googleButtonRef.current) return undefined;

    let cancelled = false;
    const renderGoogleButton = () => {
      if (
        cancelled ||
        !googleButtonRef.current ||
        !window.google?.accounts?.id
      ) {
        return;
      }
      // Read layout metrics before mutating the DOM below. Measuring
      // clientWidth right after clearing innerHTML forces a synchronous
      // layout recalculation (a "forced reflow"); reading it first avoids
      // that read-after-write layout thrash.
      const width = Math.floor(googleButtonRef.current.clientWidth);
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            showToast(t("Google login was cancelled."), "error");
            return;
          }
          setGoogleLoading(true);
          setGoogleNoAccount(false);
          try {
            await AuthService.loginWithGoogle(response.credential, googleIntent);
            showToast(t("Google login successful."), "success");
            navigateAfterAuth("/");
          } catch (err) {
            if (err instanceof ApiError && err.code === ACCOUNT_NOT_FOUND) {
              setGoogleNoAccount(true);
              return;
            }
            showToast(
              err instanceof Error ? err.message : t("Google login failed."),
              "error",
            );
          } finally {
            setGoogleLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: width,
        text: mode === "signup" ? "signup_with" : "signin_with",
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton);
      return () => {
        cancelled = true;
        existingScript.removeEventListener("load", renderGoogleButton);
      };
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderGoogleButton);
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.removeEventListener("load", renderGoogleButton);
    };
  }, [googleIntent, isNativeGoogleLogin, mode, navigateAfterAuth, t]);

  const handleNativeGoogleLogin = async () => {
    if (mode === "reset") return;

    // Android signs in with the Web client ID. iOS must use its own
    // "iOS" OAuth client ID (Google rejects a Web client ID on iOS); the
    // Web client ID is still passed to iOS as serverClientId in
    // capacitor.config.ts, so the ID token is issued for our backend.
    const clientId = (
      nativePlatform === "ios"
        ? process.env.REACT_APP_GOOGLE_IOS_CLIENT_ID || ""
        : process.env.REACT_APP_GOOGLE_CLIENT_ID || ""
    ).trim();

    if (!clientId) {
      showToast(
        nativePlatform === "ios"
          ? t("Google sign-in isn't set up for iOS yet. Please use email login.")
          : t("Google login needs REACT_APP_GOOGLE_CLIENT_ID."),
        "error",
      );
      return;
    }

    setGoogleLoading(true);

    try {
      if (!nativeGoogleInitializedRef.current) {
        await GoogleAuth.initialize({
          clientId,
          scopes: ["profile", "email"],
          grantOfflineAccess: false,
        });

        nativeGoogleInitializedRef.current = true;
      }

      const user = await GoogleAuth.signIn();

      setGoogleNoAccount(false);
      await AuthService.loginWithGoogle(user.authentication.idToken, googleIntent);

      showToast(t("Google login successful."), "success");
      navigateAfterAuth("/");
    } catch (err) {
      if (err instanceof ApiError && err.code === ACCOUNT_NOT_FOUND) {
        setGoogleNoAccount(true);
        // Forget the chosen Google account so the next tap shows the
        // account picker again (plugin is initialized at this point).
        void GoogleAuth.signOut().catch(() => undefined);
        return;
      }
      console.error("Google Login Error:", err);

      showToast(
        err instanceof Error ? err.message : t("Google login failed."),
        "error",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (mode === "reset" || isAppleLoading) return;
    setAppleLoading(true);
    setAppleNoAccount(false);
    try {
      const apple = await signInWithAppleNative();
      await AuthService.loginWithApple(apple, googleIntent);
      showToast(t("Apple sign-in successful."), "success");
      navigateAfterAuth("/");
    } catch (err) {
      if (err instanceof AppleSignInCancelled) return;
      if (err instanceof ApiError && err.code === ACCOUNT_NOT_FOUND) {
        setAppleNoAccount(true);
        return;
      }
      // Capacitor's iOS console prints Error objects as "{}", so log the
      // useful fields explicitly.
      console.error(
        "Apple Sign In Error:",
        JSON.stringify({
          name: (err as Error)?.name,
          message: (err as Error)?.message ?? String(err),
          status: err instanceof ApiError ? err.status : undefined,
          code: err instanceof ApiError ? err.code : undefined,
          data: err instanceof ApiError ? err.data : undefined,
        }),
      );
      showToast(
        err instanceof Error && err.message
          ? err.message
          : t("Apple sign-in failed."),
        "error",
      );
    } finally {
      setAppleLoading(false);
    }
  };

  React.useEffect(() => {
    setStep("form");
    setEmailCode("");
    setResendIn(0);
    setGoogleNoAccount(false);
    setAppleNoAccount(false);
    setMobileNoAccount(false);
    setMobileOtpSent(false);
    setMobileOtp("");
  }, [mode]);

  React.useEffect(() => {
    let cancelled = false;
    // iOS: no mobile-number login or sign-up at all (email only).
    if (IS_IOS_APP) return undefined;
    void AuthService.getAuthConfig().then((config) => {
      if (!cancelled) setMobileLoginEnabled(config.mobileOtpLogin === true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (mobileResendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setMobileResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [mobileResendIn]);

  React.useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const goToCodeStep = (seconds?: number) => {
    setEmailCode("");
    setResendIn(typeof seconds === "number" && seconds > 0 ? seconds : 60);
    setStep("code");
  };

  const handleResendCode = async () => {
    if (resendIn > 0 || isResending) return;
    setResending(true);
    try {
      const res =
        mode === "reset"
          ? await AuthService.forgotPassword(email.trim())
          : await AuthService.resendVerificationEmail(email.trim());
      setResendIn(res.resendAfterSeconds && res.resendAfterSeconds > 0 ? res.resendAfterSeconds : 60);
      showToast(t(res.message || "We've sent a new code to your email."), "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("Something went wrong."), "error");
    } finally {
      setResending(false);
    }
  };

  const handleSubmitCode = async () => {
    const code = emailCode.replace(/\D/g, "");
    if (code.length !== 6) {
      showToast(t("Enter the 6-digit code from your email."), "error");
      return;
    }
    if (mode === "reset") {
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
      if (mode === "reset") {
        await AuthService.resetPassword(email.trim(), code, password);
        showToast(t("Password updated. You're logged in."), "success");
      } else {
        await AuthService.verifyEmail(email.trim(), code);
        showToast(
          mode === "signup"
            ? t("Email verified. Your account is ready.")
            : t("Email verified. Login successful."),
          "success",
        );
      }
      navigateAfterAuth("/");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("Something went wrong."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isCodeStep) {
      await handleSubmitCode();
      return;
    }

    if (!email.trim()) {
      showToast(t("Please enter your email."), "error");
      return;
    }
    if (mode === "reset") {
      setSubmitting(true);
      try {
        const res = await AuthService.forgotPassword(email.trim());
        showToast(t("Check your email for a 6-digit code."), "success");
        goToCodeStep(res.resendAfterSeconds);
      } catch (err) {
        showToast(err instanceof Error ? err.message : t("Something went wrong."), "error");
      } finally {
        setSubmitting(false);
      }
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
    if (mode === "signup") {
      // No "confirm password" on sign-up (the eye button shows what was
      // typed); it's still asked for when resetting a password.
      if (password.length < 6) {
        showToast(t("Password must be at least 6 characters."), "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await AuthService.login(email.trim(), password);
        showToast(t("Login successful."), "success");
        navigateAfterAuth("/");
      } else {
        const res = await AuthService.signup(name.trim(), email.trim(), password);
        if (res.verificationRequired) {
          showToast(t("We've sent a 6-digit code to your email."), "success");
          goToCodeStep(res.resendAfterSeconds);
        } else {
          showToast(t("Account created successfully."), "success");
          navigateAfterAuth("/");
        }
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === EMAIL_NOT_VERIFIED) {
        showToast(t("Please verify your email. We've sent you a 6-digit code."), "info");
        goToCodeStep(
          typeof err.data.resendAfterSeconds === "number"
            ? err.data.resendAfterSeconds
            : undefined,
        );
        return;
      }
      showToast(
        err instanceof Error ? err.message : t("Something went wrong."),
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestMobileOtp = async () => {
    const normalizedMobileNumber = mobileNumber.trim();
    if (!normalizedMobileNumber) {
      showToast(t("Please enter your mobile number."), "error");
      return;
    }
    if (mobileResendIn > 0) return;

    setMobileSubmitting(true);
    setMobileNoAccount(false);
    try {
      const res = (await AuthService.requestMobileOtp(
        normalizedMobileNumber,
        googleIntent,
      )) as { otp?: string; resendAfterSeconds?: number; delivery?: string };
      if (res && res.otp) {
        // The backend returns the code itself when SMS sending is turned
        // off (SMS_DELIVERY=direct): fill it in so the user just confirms.
        setMobileOtp(res.otp);
      }
      setMobileOtpSent(true);
      setMobileResendIn(
        res?.resendAfterSeconds && res.resendAfterSeconds > 0 ? res.resendAfterSeconds : 60,
      );
      showToast(
        res?.otp
          ? t("Your code is filled in. Tap Verify to continue.")
          : t("We've sent a 6-digit code by SMS."),
        "success",
      );
    } catch (err) {
      if (err instanceof ApiError && err.code === ACCOUNT_NOT_FOUND) {
        setMobileNoAccount(true);
        return;
      }
      if (err instanceof ApiError && typeof err.data.resendAfterSeconds === "number") {
        setMobileResendIn(err.data.resendAfterSeconds);
      }
      showToast(
        err instanceof Error ? err.message : t("Unable to send OTP."),
        "error",
      );
    } finally {
      setMobileSubmitting(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    const normalizedMobileNumber = mobileNumber.trim();
    const normalizedOtp = mobileOtp.replace(/\D/g, "");
    if (!normalizedMobileNumber) {
      showToast(t("Please enter your mobile number."), "error");
      return;
    }
    if (normalizedOtp.length !== 6) {
      showToast(t("Enter the 6-digit code from the SMS."), "error");
      return;
    }

    setMobileSubmitting(true);
    try {
      await AuthService.verifyMobileOtp(
        normalizedMobileNumber,
        normalizedOtp,
        googleIntent,
        mode === "signup" ? name.trim() || undefined : undefined,
      );
      showToast(
        mode === "signup"
          ? t("Mobile number verified. Your account is ready.")
          : t("Mobile login successful."),
        "success",
      );
      navigateAfterAuth("/");
    } catch (err) {
      if (err instanceof ApiError && err.code === ACCOUNT_NOT_FOUND) {
        setMobileNoAccount(true);
        return;
      }
      showToast(
        err instanceof Error ? err.message : t("Unable to verify OTP."),
        "error",
      );
    } finally {
      setMobileSubmitting(false);
    }
  };

  const showBrandPanel = mode !== "reset";
  const fieldIconSx = { color: "#8a96a3", fontSize: 20 };
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      minHeight: 46,
    },
  };

  return (
    <>
      <MetaHelmet
        pageTitle={copy.title}
        canonical={location.pathname}
        description={`${copy.title} for Cricket Score Counter.`}
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          flex: "1 0 auto",
          display: "flex",
          // Phones: card sits near the top instead of floating mid-screen.
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: showBrandPanel ? { xs: 460, md: 920 } : 460,
            // Desktop: login and sign-up share one height, so switching tabs
            // doesn't move the card. Phones size the card to its content (a
            // fixed height there left a big empty gap inside the login card).
            minHeight: showBrandPanel ? { xs: 0, md: 540 } : undefined,
            borderRadius: 4,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: showBrandPanel ? { xs: "minmax(0, 1fr)", md: "0.9fr 1.1fr" } : "minmax(0, 1fr)",
            background: "#fff",
            boxShadow:
              "0 18px 50px color-mix(in srgb, var(--app-accent-end, #185a9d) 28%, transparent 72%)",
          }}
        >
          {showBrandPanel ? (
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(160deg, #0c3558 0%, color-mix(in srgb, var(--app-accent-end, #185a9d) 85%, #0c3558 15%) 100%)",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: 320,
                  height: 320,
                  right: -120,
                  bottom: -120,
                  borderRadius: "50%",
                  border: "40px solid rgba(255,255,255,0.06)",
                  pointerEvents: "none",
                },
              }}
            >
              {/* Kept together at the top rather than spread over the height
                  of a long form (sign-up). */}
              <Stack spacing={2.5} sx={{ position: "relative", p: 3.5, zIndex: 1 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box component="img" src="/images/logo.png" alt="" sx={{ width: 40, height: 40, borderRadius: 2, background: "#fff" }} />
                  <Typography sx={{ fontWeight: 900, fontSize: "calc(17px * var(--app-font-scale, 1))" }}>
                    Cricket Score Counter
                  </Typography>
                </Stack>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: "calc(30px * var(--app-font-scale, 1))", lineHeight: 1.1, mb: 1 }}>
                    {mode === "login" ? t("Good to see you again.") : t("Score. Share. Celebrate.")}
                  </Typography>
                  <Typography sx={{ opacity: 0.88, fontWeight: 600 }}>
                    {mode === "login"
                      ? t("Pick up your matches, tournaments and stats right where you left off.")
                      : t("Everything your cricket needs, on web, Android and iOS.")}
                  </Typography>
                </Box>
                <Stack spacing={1.1}>
                  {[
                    { icon: <SportsCricketRounded />, text: t("Ball-by-ball scoring anyone can watch live") },
                    { icon: <EmojiEventsRounded />, text: t("Tournaments with fixtures and points table") },
                    { icon: <InsightsRounded />, text: t("Player profiles and career stats") },
                  ].map((item) => (
                    <Stack key={item.text} direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          flex: "none",
                          borderRadius: 2,
                          display: "grid",
                          placeItems: "center",
                          color: "var(--app-accent-start, #43cea2)",
                          background: "rgba(255,255,255,0.1)",
                          "& svg": { fontSize: 20 },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 700 }}>{item.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
                {/* A glimpse of the product: a live scorecard as viewers see it. */}
                <Box
                  aria-hidden
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box component="span" sx={{ fontSize: 11, fontWeight: 900, background: "#e0463c", borderRadius: 99, px: 1, py: 0.2 }}>
                      ● {t("LIVE")}
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, opacity: 0.75 }}>{t("Over")} 9.2 / 10</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 1 }}>
                    <Typography sx={{ fontWeight: 900 }}>Pune Panthers</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: 22 }}>84/3</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 12.5, opacity: 0.75, fontWeight: 600 }}>vs Kothrud Kings · {t("need 7 off 4")}</Typography>
                  <Stack direction="row" spacing={0.75} sx={{ mt: 1.25 }}>
                    {["1", "4", "•", "W", "6", "2"].map((ball, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: 900,
                          color: ball === "W" ? "#fff" : ball === "4" || ball === "6" ? "#0c3558" : "#fff",
                          background:
                            ball === "W"
                              ? "#e0463c"
                              : ball === "4" || ball === "6"
                                ? "var(--app-accent-start, #43cea2)"
                                : "rgba(255,255,255,0.14)",
                        }}
                      >
                        {ball}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          ) : null}
          <Box sx={{ p: { xs: 2.25, sm: 2.75 }, display: "flex", flexDirection: "column" }}>
          <Stack spacing={1.25} sx={{ flex: 1 }}>
            {mode !== "reset" && !isCodeStep ? (
              <Box
                role="tablist"
                aria-label={t("Login or sign up")}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  p: 0.5,
                  borderRadius: 999,
                  background: "rgba(12,53,88,0.07)",
                }}
              >
                {(["login", "signup"] as const).map((tab) => {
                  const active = mode === tab;
                  return (
                    <Box
                      key={tab}
                      component="button"
                      type="button"
                      role="tab"
                      aria-selected={active}
                      data-ga-click={`auth_tab_${tab}`}
                      onClick={() => !active && navigate(tab === "login" ? "/login" : "/signup", { state: location.state })}
                      sx={{
                        all: "unset",
                        boxSizing: "border-box",
                        cursor: active ? "default" : "pointer",
                        textAlign: "center",
                        py: 0.8,
                        borderRadius: 999,
                        fontWeight: 900,
                        fontSize: "calc(14px * var(--app-font-scale, 1))",
                        color: active ? "#0c3558" : "#5b6976",
                        background: active ? "#fff" : "transparent",
                        boxShadow: active ? "0 2px 8px rgba(12,53,88,0.14)" : "none",
                        transition: "background .15s, color .15s",
                        "&:focus-visible": { outline: "2px solid var(--app-accent-end, #185a9d)", outlineOffset: 2 },
                      }}
                    >
                      {tab === "login" ? t("Login") : t("Sign Up")}
                    </Box>
                  );
                })}
              </Box>
            ) : null}
            {/* On sign-up the "Sign Up" tab is the heading (keeps the form on one screen). */}
            <Box
              sx={
                mode === "signup" && !isCodeStep
                  ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }
                  : undefined
              }
            >
              <Typography
                component="h1"
                sx={{
                  fontWeight: 900,
                  color: "#0c3558",
                  fontSize: "calc(22px * var(--app-font-scale, 1))",
                  lineHeight: 1.15,
                }}
              >
                {isCodeStep && mode !== "reset"
                  ? t("Verify your email")
                  : mode === "login"
                    ? t("Welcome back")
                    : mode === "signup"
                      ? t("Create your account")
                      : t(copy.title)}
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  color: "#526274",
                  fontWeight: 600,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  display: mode === "signup" && !isCodeStep ? "none" : undefined,
                }}
              >
                {isCodeStep
                  ? t("Enter the 6-digit code we emailed to {{email}}.", {
                      email: email.trim(),
                    })
                  : t(copy.subtitle)}
              </Typography>
            </Box>

            {mode === "signup" && !isCodeStep ? (
              <Box>
                <Typography
                  id="join-role-label"
                  sx={{ fontWeight: 800, color: "#526274", fontSize: "calc(12.5px * var(--app-font-scale, 1))", mb: 0.6 }}
                >
                  {t("I'm joining as")}{" "}
                  <Box component="span" sx={{ fontWeight: 600, color: "#8a96a3" }}>
                    · {t("you can do both later")}
                  </Box>
                </Typography>
                <Box role="radiogroup" aria-labelledby="join-role-label" sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 1 }}>
                  {(
                    [
                      { role: "player", emoji: "🏏", label: t("Player"), short: t("Player") },
                      { role: "organizer", emoji: "🏆", label: t("Organizer / scorer"), short: t("Organizer") },
                    ] as const
                  ).map((option) => {
                    const selected = joinRole === option.role;
                    return (
                      <Box
                        key={option.role}
                        component="button"
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        data-ga-click={`signup_role_${option.role}`}
                        onClick={() => setJoinRole(selected ? null : option.role)}
                        sx={{
                          all: "unset",
                          boxSizing: "border-box",
                          cursor: "pointer",
                          px: 1.25,
                          py: 0.9,
                          borderRadius: 2,
                          textAlign: "center",
                          fontWeight: 900,
                          fontSize: "calc(13.5px * var(--app-font-scale, 1))",
                          color: "#0c3558",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          border: "2px solid",
                          borderColor: selected ? "var(--app-accent-end, #185a9d)" : "rgba(12,53,88,0.15)",
                          background: selected
                            ? "color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #ffffff 86%)"
                            : "#fff",
                          transition: "border-color .15s, background .15s",
                          "&:focus-visible": { outline: "2px solid var(--app-accent-end, #185a9d)", outlineOffset: 2 },
                        }}
                      >
                        {option.emoji}{" "}
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>{option.label}</Box>
                        <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>{option.short}</Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : null}
            {mode === "login" && !isCodeStep && authState?.join_role ? (
              <Typography
                sx={{
                  p: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                  color: "#0c3558",
                  background: "color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #ffffff 86%)",
                }}
              >
                {authState.join_role === "player"
                  ? t("Next, you'll set up your player profile.")
                  : t("Next, you'll go to Tournaments to set up your first one.")}
              </Typography>
            ) : null}
            {/* iOS offers Sign in with Apple alongside Google (App Store
                Guideline 4.8). Mobile OTP stays hidden on iOS: there's no
                SMS provider yet, so App Review couldn't log in with it. */}
            {mode !== "reset" && !isCodeStep ? (
              <>
                {IS_IOS_APP ? (
                  <>
                    {/* Apple's HIG: black button, Apple logo, at least as
                        prominent as the other sign-in options. */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        disabled={isAppleLoading}
                        onClick={handleAppleLogin}
                        startIcon={<AppleIcon sx={{ fontSize: 22 }} />}
                        sx={{
                          maxWidth: 360,
                          width: "100%",
                          height: 48,
                          borderRadius: 2,
                          backgroundColor: "#000",
                          color: "#fff",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": { backgroundColor: "#1a1a1a", boxShadow: "none" },
                          "&:active": { backgroundColor: "#333" },
                          "&.Mui-disabled": {
                            backgroundColor: "#000",
                            color: "rgba(255,255,255,0.7)",
                            opacity: 0.65,
                          },
                          "& .MuiButton-startIcon": { marginRight: 1 },
                        }}
                      >
                        {isAppleLoading
                          ? t("Signing in...")
                          : mode === "signup"
                            ? t("Sign up with Apple")
                            : t("Sign in with Apple")}
                      </Button>
                    </Box>
                    {appleNoAccount ? (
                      <Alert
                        severity="info"
                        sx={{ alignItems: "center" }}
                        action={
                          <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate("/signup", { state: location.state })}
                            sx={{ fontWeight: 900, textTransform: "none" }}
                          >
                            {t("Sign up")}
                          </Button>
                        }
                      >
                        {t("No account found for this Apple ID. Sign up first to create one.")}
                      </Alert>
                    ) : null}
                  </>
                ) : null}

                {!IS_IOS_APP || isGoogleConfigured ? (
                <>
                <Box
                  sx={{
                    minHeight: 44,
                    display: "flex",
                    justifyContent: "center",
                    opacity: isGoogleLoading ? 0.65 : 1,
                    pointerEvents: isGoogleLoading ? "none" : "auto",
                  }}
                >
                  {(process.env.REACT_APP_GOOGLE_CLIENT_ID || "").trim() ? (
                    isNativeGoogleLogin ? (
                      <Button
                        type="button"
                        variant="outlined"
                        fullWidth
                        disabled={isGoogleLoading}
                        onClick={handleNativeGoogleLogin}
                        startIcon={<GoogleIcon />}
                        sx={{
                          maxWidth: 360,
                          width: "100%",
                          height: 48,
                          borderRadius: 2,
                          border: "1px solid #DADCE0",
                          backgroundColor: "#fff",
                          color: "#3C4043",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          textTransform: "none",
                          boxShadow: "none",

                          "&:hover": {
                            backgroundColor: "#F8F9FA",
                            borderColor: "#C7C9CC",
                            boxShadow: "0 1px 2px rgba(60,64,67,.2)",
                          },

                          "&:active": {
                            backgroundColor: "#F1F3F4",
                          },

                          "&.Mui-disabled": {
                            backgroundColor: "#F8F9FA",
                            color: "#9AA0A6",
                            borderColor: "#E0E0E0",
                          },

                          "& .MuiButton-startIcon": {
                            marginRight: 1,
                          },
                        }}
                      >
                        {isGoogleLoading
                          ? t("Signing in...")
                          : t("Continue with Google")}
                      </Button>
                    ) : (
                      <Box
                        ref={googleButtonRef}
                        sx={{
                          width: "100%",
                          maxWidth: 240,
                          mx: "auto",
                        }}
                      />
                    )
                  ) : (
                    <Alert
                      severity="info"
                      sx={{ width: "100%" }}
                    >
                      {t("Google login needs REACT_APP_GOOGLE_CLIENT_ID.")}
                    </Alert>
                  )}
                </Box>
                {googleNoAccount ? (
                  <Alert
                    severity="info"
                    sx={{ alignItems: "center" }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => navigate("/signup", { state: location.state })}
                        sx={{ fontWeight: 900, textTransform: "none" }}
                      >
                        {t("Sign up")}
                      </Button>
                    }
                  >
                    {t("No account found for this Google account. Sign up first to create one.")}
                  </Alert>
                ) : null}

                </>
                ) : null}

                <Divider sx={{ fontWeight: 800, color: "text.secondary", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
                  {t("or use email")}
                </Divider>
              </>
            ) : null}
            {mode === "signup" && !isCodeStep ? (
              <TextField
                label={t("Name")}
                size="small"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                autoComplete="name"
                sx={textFieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineRounded sx={fieldIconSx} /></InputAdornment> }}
              />
            ) : null}
            {!isCodeStep ? (
              <TextField
                label={t("Email")}
                size="small"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                autoComplete="email"
                sx={textFieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineRounded sx={fieldIconSx} /></InputAdornment> }}
              />
            ) : null}
            {isCodeStep ? (
              <Stack spacing={1}>
                <TextField
                  label={t("6-digit code")}
                  value={emailCode}
                  onChange={(event) =>
                    setEmailCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  fullWidth
                  autoFocus
                  autoComplete="one-time-code"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 6,
                    "aria-label": t("6-digit code"),
                    style: {
                      textAlign: "center",
                      letterSpacing: "0.5em",
                      fontWeight: 900,
                      fontSize: "calc(22px * var(--app-font-scale, 1))",
                    },
                  }}
                  sx={textFieldSx}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendIn > 0 || isResending}
                    sx={{ textTransform: "none", fontWeight: 800, px: 0.5 }}
                  >
                    {resendIn > 0
                      ? t("Resend code in {{seconds}}s", { seconds: resendIn })
                      : isResending
                        ? t("Sending…")
                        : t("Resend code")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setEmailCode("");
                    }}
                    sx={{ textTransform: "none", fontWeight: 800, px: 0.5 }}
                  >
                    {t("Change email")}
                  </Button>
                </Box>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    opacity: 0.8,
                    fontWeight: 600,
                    fontSize: "calc(12px * var(--app-font-scale, 1))",
                  }}
                >
                  {t("Can't find it? Check your spam or promotions folder.")}
                </Typography>
              </Stack>
            ) : null}
            {(mode !== "reset" && !isCodeStep) || (mode === "reset" && isCodeStep) ? (
            <TextField
              label={
                mode === "reset"
                  ? t("New Password")
                  : mode === "signup"
                    ? t("Password (6+ characters)")
                    : t("Password")
              }
              type={showPassword ? "text" : "password"}
              size="small"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              sx={textFieldSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlined sx={fieldIconSx} /></InputAdornment>,
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
            {mode === "login" && !isCodeStep ? (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "-8px !important" }}>
                <Button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  sx={{ textTransform: "none", fontWeight: 800, px: 0.5, minHeight: 0, fontSize: "calc(13px * var(--app-font-scale, 1))" }}
                >
                  {t("Forgot password?")}
                </Button>
              </Box>
            ) : null}
            {mode === "reset" && isCodeStep ? (
              <TextField
                label={t("Confirm Password")}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                autoComplete="new-password"
                sx={textFieldSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlined sx={fieldIconSx} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label={showConfirmPassword ? t("Hide password") : t("Show password")}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
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
              {isSubmitting
                ? t("Please wait...")
                : isCodeStep
                  ? mode === "reset"
                    ? t("Update Password")
                    : t("Verify")
                  : t(copy.action)}
            </Button>

            {/* Mobile number sign-in sits last, as an alternative to email. */}
            {mode !== "reset" && !isCodeStep && isMobileLoginEnabled && !IS_IOS_APP && !showMobileOption ? (
              <Button
                type="button"
                data-ga-click="auth_use_mobile"
                onClick={() => setShowMobileOption(true)}
                startIcon={<PhoneIphoneRounded />}
                sx={{
                  alignSelf: "center",
                  mt: "4px !important",
                  px: 1.75,
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 800,
                  color: "var(--app-accent-text, #185a9d)",
                  background: "transparent",
                  "& .MuiButton-startIcon": { color: "var(--app-accent-end, #185a9d)" },
                  "&:hover, &.Mui-focusVisible": {
                    color: "var(--app-accent-text, #185a9d)",
                    background: "color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #ffffff 86%)",
                  },
                }}
              >
                {mode === "signup" ? t("Sign up with mobile number instead") : t("Use mobile number instead")}
              </Button>
            ) : null}
            {mode !== "reset" && !isCodeStep && isMobileLoginEnabled && !IS_IOS_APP && showMobileOption ? (
              <>
                <Divider sx={{ fontWeight: 800, color: "text.secondary", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
                  {t("or use your mobile number")}
                </Divider>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border:
                      "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
                    background: "rgba(255,255,255,0.76)",
                  }}
                >
                  <Stack spacing={1.2}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <PhoneIphoneRounded color="primary" />
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: "var(--app-accent-text, #185a9d)",
                        }}
                      >
                        {mode === "signup"
                          ? t("Sign up with mobile number")
                          : t("Login with mobile number")}
                      </Typography>
                    </Box>
                    <TextField
                      label={t("Mobile Number")}
                      value={mobileNumber}
                      onChange={(event) => {
                        setMobileNumber(event.target.value);
                        setMobileNoAccount(false);
                      }}
                      fullWidth
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 9876543210"
                      helperText={t("Include your country code, e.g. +91.")}
                      disabled={isMobileOtpSent && isMobileSubmitting}
                    />
                    {mobileNoAccount ? (
                      <Alert
                        severity="info"
                        sx={{ alignItems: "center" }}
                        action={
                          <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate("/signup", { state: location.state })}
                            sx={{ fontWeight: 900, textTransform: "none" }}
                          >
                            {t("Sign up")}
                          </Button>
                        }
                      >
                        {t("No account found for this mobile number. Sign up first to create one.")}
                      </Alert>
                    ) : null}
                    {isMobileOtpSent ? (
                      <TextField
                        label={t("6-digit code")}
                        value={mobileOtp}
                        onChange={(event) =>
                          setMobileOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        fullWidth
                        autoFocus
                        autoComplete="one-time-code"
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 6,
                          "aria-label": t("6-digit code"),
                          style: { textAlign: "center", letterSpacing: "0.4em", fontWeight: 900 },
                        }}
                      />
                    ) : null}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap" useFlexGap>
                      <Button
                        type="button"
                        variant={isMobileOtpSent ? "outlined" : "contained"}
                        sx={{
                          minHeight: 46,
                          borderRadius: 2,
                          fontWeight: 900,
                          textTransform: "none",
                          ...(isMobileOtpSent
                            ? {}
                            : {
                                color: "#fff",
                                background:
                                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                                "&:hover, &:active, &:focus, &.Mui-focusVisible": {
                                  color: "#fff",
                                  background:
                                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                                },
                              }),
                        }}
                        startIcon={<SmsRounded />}
                        disabled={isMobileSubmitting || mobileResendIn > 0}
                        onClick={handleRequestMobileOtp}
                      >
                        {mobileResendIn > 0
                          ? t("Resend in {{seconds}}s", { seconds: mobileResendIn })
                          : isMobileOtpSent
                            ? t("Resend code")
                            : isMobileSubmitting
                              ? t("Sending…")
                              : t("Send code")}
                      </Button>
                      {isMobileOtpSent ? (
                        <Button
                          type="button"
                          variant="contained"
                          sx={{
                            flex: 1,
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
                          disabled={isMobileSubmitting}
                          onClick={handleVerifyMobileOtp}
                        >
                          {isMobileSubmitting
                            ? t("Please wait...")
                            : mode === "signup"
                              ? t("Verify & Sign up")
                              : t("Verify & Login")}
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </Paper>
              </>
            ) : null}

            {mode === "reset" ? (
              <Button
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontWeight: 800, alignSelf: "center" }}
              >
                {t("Back to login")}
              </Button>
            ) : !isCodeStep ? (
              <Typography sx={{ textAlign: "center", color: "#6b7785", fontSize: "calc(12px * var(--app-font-scale, 1))", fontWeight: 600, mt: "auto !important", pt: 1.25 }}>
                {mode === "signup" ? t("By signing up you agree to our") : t("By continuing you agree to our")}{" "}
                <Box component="a" href="/terms" sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>{t("Terms")}</Box>
                {" & "}
                <Box component="a" href="/privacy-policy" sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>{t("Privacy Policy")}</Box>
              </Typography>
            ) : null}
          </Stack>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={3200}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
