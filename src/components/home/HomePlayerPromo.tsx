import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import {
  BadgeRounded,
  PersonSearchRounded,
  SearchRounded,
  SportsCricketRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AuthService from "../../services/AuthService";
import ExploreService from "../../services/ExploreService";
import PlayerAccountService, { playerAvatarSrc, type PublicPlayer } from "../../services/PlayerAccountService";
import { startAs } from "../../utils/playerOnboarding";
import { APP_URL } from "../../utils/constant";
import { IS_IOS_APP } from "../../utils/platform";
import { copyText, shareNative } from "../../utils/share";
import { BOARD } from "../../utils/brand";
import ShareButton from "../share/ShareButton";
import { darkBoardBackground, goldButtonSx } from "../ui/Pavilion";

type Viewer = "anonymous" | "no-profile" | "has-profile";

/** Where "Claim my stats" lands: profile setup, then the find-my-records tab. */
const CLAIM_DESTINATION = "/me?welcome=player&tab=records";

const glassButtonSx = {
  borderRadius: 99,
  minHeight: 46,
  px: 2.5,
  fontWeight: 900,
  textTransform: "none",
  color: "#fff !important",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.32)",
  backdropFilter: "blur(4px)",
  "&:hover": { background: "rgba(255,255,255,0.14)", borderColor: BOARD.goldLight },
  "& .MuiSvgIcon-root": { color: `${BOARD.goldLight} !important` },
} as const;

const fmt = (n: number) => n.toLocaleString();

/** A sample player card, so people see what they get. */
const CardPreview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box aria-hidden sx={{ width: 250, flex: "none", transform: "rotate(3deg)" }}>
      <Box
        sx={{
          p: "3px",
          borderRadius: 4,
          background: `linear-gradient(145deg, #FBEBBE 0%, ${BOARD.gold} 45%, #8a6a22 100%)`,
          boxShadow: "0 22px 44px rgba(0,0,0,0.45), 0 0 30px rgba(217,180,90,0.25)",
        }}
      >
        <Box
          sx={{
            borderRadius: 3.5,
            overflow: "hidden",
            color: "#fff",
            textAlign: "center",
            background: [
              "radial-gradient(90% 60% at 50% 0%, rgba(241,214,138,0.25) 0%, transparent 70%)",
              "repeating-linear-gradient(100deg, rgba(255,255,255,0.04) 0 18px, rgba(255,255,255,0) 18px 36px)",
              `linear-gradient(160deg, #1d4b3b 0%, ${BOARD.green} 55%, ${BOARD.greenDeep} 100%)`,
            ].join(", "),
            px: 2,
            pt: 2,
            pb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontSize: 22,
              border: `2px solid ${BOARD.goldLight}`,
              background: "linear-gradient(135deg, #f7971e 0%, #e0463c 100%)",
            }}
          >
            AK
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 17, mt: 0.9 }}>Aarav Kulkarni</Typography>
          <Typography sx={{ color: BOARD.goldLight, fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
            {t("All-rounder")}
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, mt: 0.6, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>
            <VerifiedRounded sx={{ fontSize: 14, color: "#5fd39b" }} /> {t("Registered player")}
          </Box>
          <Box
            sx={{
              mt: 1.25,
              pt: 1.1,
              borderTop: "1px dashed rgba(241,214,138,0.3)",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            {[
              ["42", t("Matches")],
              ["1,284", t("Runs")],
              ["37", t("Wickets")],
            ].map(([v, l]) => (
              <Box key={l}>
                <Typography sx={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 800, fontSize: 18, color: BOARD.goldLight, textShadow: "0 0 10px rgba(241,214,138,0.35)" }}>
                  {v}
                </Typography>
                <Typography sx={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{l}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/** Avatars of the latest real players (web/Android only; iOS shows the count alone). */
const AvatarStack: React.FC<{ players: PublicPlayer[] }> = ({ players }) => (
  <Box sx={{ display: "flex", "& > *:not(:first-of-type)": { ml: "-10px" } }}>
    {players.map((p) => (
      <Avatar
        key={p.id}
        src={playerAvatarSrc(p.avatarUrl) || undefined}
        alt=""
        sx={{
          width: 32,
          height: 32,
          fontSize: 13,
          fontWeight: 900,
          border: `2px solid ${BOARD.green}`,
          boxShadow: "0 0 0 1px rgba(241,214,138,0.5)",
          background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
        }}
      >
        {p.name.trim()[0]?.toUpperCase()}
      </Avatar>
    ))}
  </Box>
);

/**
 * Home-screen drive for player profiles. Visitors without a profile see a
 * "your cricket career on one card" pitch, real social proof and a name
 * search that tells them how many player records with match stats already
 * match their name (counts only), so they sign up to claim them. People who
 * already have a profile see an invite-your-teammates card instead.
 */
const HomePlayerPromo: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [viewer, setViewer] = React.useState<Viewer>("anonymous");
  const [registered, setRegistered] = React.useState<number | null>(null);
  const [recent, setRecent] = React.useState<PublicPlayer[]>([]);
  const [name, setName] = React.useState("");
  const [matches, setMatches] = React.useState<number | null>(null);
  const [checking, setChecking] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!AuthService.isLoggedIn()) return;
    let cancelled = false;
    setViewer("no-profile");
    PlayerAccountService.getMyPlayer()
      .then((r) => !cancelled && setViewer(r.player ? "has-profile" : "no-profile"))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    ExploreService.playersWaiting()
      .then((r) => setRegistered(r.registered))
      .catch(() => undefined);
    if (IS_IOS_APP) return;
    ExploreService.players("", 1)
      .then((r) => setRecent(r.players.slice(0, 5)))
      .catch(() => undefined);
  }, []);

  // Debounced "is my name already in the app?" check.
  const query = name.trim();
  React.useEffect(() => {
    if (query.length < 3) {
      setMatches(null);
      setChecking(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    const timer = window.setTimeout(() => {
      ExploreService.playersWaiting(query)
        .then((r) => !cancelled && setMatches(r.matches))
        .catch(() => !cancelled && setMatches(null))
        .finally(() => !cancelled && setChecking(false));
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const invite = async () => {
    const url = `${APP_URL}/signup`;
    const text = t("I keep my cricket stats on Cricket Score Counter. Make your player card so our matches count for both of us:");
    const outcome = await shareNative({ title: t("Make your player card"), text, url });
    if (outcome === "unsupported" && (await copyText(`${text} ${url}`))) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  const shell = (children: React.ReactNode) => (
    <Box
      component="section"
      aria-label={t("Player profiles")}
      sx={{
        width: "100%",
        maxWidth: 1080,
        mx: "auto",
        mb: 2,
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        textAlign: "left",
        color: "#fff",
        borderRadius: { xs: 4, sm: 5 },
        p: { xs: 2, sm: 3 },
        border: "1px solid rgba(217,180,90,0.4)",
        background: darkBoardBackground,
        boxShadow: "0 18px 44px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <SportsCricketRounded
        aria-hidden
        sx={{ position: "absolute", zIndex: -1, left: -30, bottom: -40, fontSize: 200, color: BOARD.goldLight, opacity: 0.05, transform: "rotate(-20deg)" }}
      />
      {children}
    </Box>
  );

  const eyebrow = (label: string) => (
    <Typography sx={{ fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", fontSize: "calc(11px * var(--app-font-scale, 1))", color: BOARD.goldLight, mb: 0.5 }}>
      {label}
    </Typography>
  );

  // Already has a card: turn them into a recruiter.
  if (viewer === "has-profile") {
    return shell(
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
        <Box sx={{ minWidth: 0 }}>
          {eyebrow(t("Your team"))}
          <Typography component="h2" sx={{ fontWeight: 900, fontSize: { xs: "calc(20px * var(--app-font-scale, 1))", sm: "calc(24px * var(--app-font-scale, 1))" }, lineHeight: 1.15 }}>
            {t("Get your teammates on the app")}
          </Typography>
          <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.78)", fontWeight: 600, fontSize: 14.5, maxWidth: 560 }}>
            {t("When every player in your squad has a card, every run and wicket in your matches lands on the right profile.")}
          </Typography>
          {copied && (
            <Typography sx={{ mt: 0.75, color: BOARD.goldLight, fontWeight: 800, fontSize: 13 }}>{t("Invite link copied")}</Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ flex: "none", "& > *": { flex: { xs: "1 1 auto", sm: "0 0 auto" } } }}>
          <ShareButton onClick={invite} data-ga-click="home_invite_teammates">
            {t("Invite teammates")}
          </ShareButton>
          <Button startIcon={<BadgeRounded />} onClick={() => navigate("/me")} sx={glassButtonSx} data-ga-click="home_view_my_card">
            {t("My card")}
          </Button>
        </Stack>
      </Stack>,
    );
  }

  const claim = () => startAs(navigate, "player", "signup", CLAIM_DESTINATION);

  return shell(
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ md: "center" }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {eyebrow(t("Player profiles · Free"))}
        <Typography component="h2" sx={{ fontWeight: 900, fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(30px * var(--app-font-scale, 1))" }, lineHeight: 1.12, letterSpacing: -0.3 }}>
          {t("Your cricket career, on one card")}
        </Typography>
        <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,0.78)", fontWeight: 600, fontSize: { xs: 14, sm: 15.5 }, lineHeight: 1.45, maxWidth: 560 }}>
          {t("Runs, wickets and form from every match scored here, on a player card you can share.")}
        </Typography>

        {registered !== null && registered > 0 && (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.5 }}>
            {recent.length > 0 && <AvatarStack players={recent} />}
            <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: "rgba(255,255,255,0.88)" }}>
              <Box component="span" sx={{ color: BOARD.goldLight, fontWeight: 900 }}>{fmt(registered)}</Box>{" "}
              {registered === 1 ? t("player already has a card") : t("players already have a card")}
            </Typography>
          </Stack>
        )}

        {/* Find my stats */}
        <Box
          sx={{
            mt: 2,
            p: { xs: 1.25, sm: 1.5 },
            borderRadius: 3,
            background: "rgba(0,0,0,0.22)",
            border: "1px solid rgba(241,214,138,0.22)",
          }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PersonSearchRounded sx={{ fontSize: 18, color: BOARD.goldLight }} />
            <Typography sx={{ fontWeight: 800, fontSize: 13.5 }}>{t("Played in a match scored here? Your stats may be waiting.")}</Typography>
          </Stack>
          <TextField
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder={t("Type your name")}
            inputProps={{ "aria-label": t("Your name"), autoComplete: "name" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: BOARD.goldLight }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                fontWeight: 700,
                background: "rgba(255,255,255,0.08)",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(241,214,138,0.35)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(241,214,138,0.6)" },
              },
              "& input::placeholder": { color: "rgba(255,255,255,0.55)", opacity: 1 },
            }}
          />
          <Box aria-live="polite" sx={{ minHeight: 22, mt: 1 }}>
            {query.length >= 3 && checking && (
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>{t("Checking…")}</Typography>
            )}
            {query.length >= 3 && !checking && matches !== null && (
              matches > 0 ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} justifyContent="space-between">
                  <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                    🏏{" "}
                    <Box component="span" sx={{ color: BOARD.goldLight }}>
                      {matches >= 99 ? "99+" : matches} {matches === 1 ? t("player record") : t("player records")}
                    </Box>{" "}
                    {t("named “{{name}}” already have match stats.", { name: query })}
                  </Typography>
                  <Button onClick={claim} sx={{ ...goldButtonSx, minHeight: 40, flex: "none" }} data-ga-click="home_claim_stats">
                    {t("Claim my stats")}
                  </Button>
                </Stack>
              ) : (
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>
                  {t("Nothing for “{{name}}” yet. Start your card and your stats build up as you play.", { name: query })}
                </Typography>
              )
            )}
          </Box>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2, "& > *": { flex: { xs: "1 1 auto", sm: "0 0 auto" } } }}>
          <Button
            startIcon={<BadgeRounded />}
            onClick={() => startAs(navigate, "player")}
            sx={goldButtonSx}
            data-ga-click="home_create_player_card"
          >
            {t("Create my player card")}
          </Button>
          <Button startIcon={<PersonSearchRounded />} onClick={() => navigate("/explore")} sx={glassButtonSx} data-ga-click="home_browse_players">
            {t("Browse players")}
          </Button>
        </Stack>
      </Box>
      <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", pr: 2 }}>
        <CardPreview />
      </Box>
    </Stack>,
  );
};

export default HomePlayerPromo;
