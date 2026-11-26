import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  BadgeRounded,
  EmojiEventsRounded,
  GroupAddRounded,
  InsightsRounded,
  IosShareRounded,
  LinkRounded,
  PersonSearchRounded,
  SportsCricketRounded,
  TimerRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AuthService from "../../services/AuthService";
import PlayerAccountService from "../../services/PlayerAccountService";
import { startAs } from "../../utils/playerOnboarding";

type Viewer = "anonymous" | "no-profile" | "has-profile";
type Persona = "player" | "organizer";

const NAVY = "#0c3558";
const MUTED = "#526274";
const ACCENT_GRADIENT =
  "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)";

const primaryButtonSx = {
  borderRadius: 99,
  px: 2.75,
  py: 1.1,
  fontWeight: 900,
  textTransform: "none",
  color: "#fff",
  background: ACCENT_GRADIENT,
  boxShadow: "0 6px 16px color-mix(in srgb, var(--app-accent-end, #185a9d) 30%, transparent 70%)",
  "&:hover": { background: ACCENT_GRADIENT, filter: "brightness(1.05)" },
} as const;

const secondaryButtonSx = {
  borderRadius: 99,
  px: 2.5,
  py: 1.1,
  fontWeight: 800,
  textTransform: "none",
  color: NAVY,
  border: "1.5px solid rgba(12,53,88,0.2)",
  "&:hover": { borderColor: NAVY, background: "rgba(12,53,88,0.04)" },
} as const;

const Benefit: React.FC<{ icon: React.ReactNode; title: string; body: string }> = ({ icon, title, body }) => (
  <Stack direction="row" spacing={1.25} alignItems="flex-start">
    <Box
      sx={{
        flex: "none",
        width: 36,
        height: 36,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        color: "var(--app-accent-end, #185a9d)",
        background: "color-mix(in srgb, var(--app-accent-start, #43cea2) 16%, #ffffff 84%)",
        "& svg": { fontSize: 20 },
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography component="h4" sx={{ fontWeight: 900, color: NAVY, fontSize: "calc(15px * var(--app-font-scale, 1))", lineHeight: 1.3 }}>
        {title}
      </Typography>
      <Typography sx={{ color: MUTED, fontSize: "calc(13.5px * var(--app-font-scale, 1))", lineHeight: 1.45, mt: 0.25 }}>
        {body}
      </Typography>
    </Box>
  </Stack>
);

/** What a player profile looks like. */
const ProfilePreview: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box aria-hidden sx={{ width: "100%", maxWidth: 300, mx: "auto" }}>
      <Box sx={{ borderRadius: 4, overflow: "hidden", background: "#fff", boxShadow: "0 16px 36px rgba(12,53,88,0.18)" }}>
        <Box sx={{ height: 54, background: ACCENT_GRADIENT }} />
        <Box sx={{ px: 2, pb: 1.5, mt: "-30px", textAlign: "center" }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 22,
              border: "3px solid #fff",
              background: "linear-gradient(135deg, #f7971e 0%, #e0463c 100%)",
            }}
          >
            AK
          </Box>
          <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: 17, mt: 0.75 }}>Aarav Kulkarni</Typography>
          <Typography sx={{ color: "#6b7785", fontSize: 12.5, fontWeight: 700 }}>@aarav.k · {t("All-rounder")}</Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3, color: "#0b7f61", fontSize: 11.5, fontWeight: 800, mt: 0.4 }}>
            <VerifiedRounded sx={{ fontSize: 14 }} /> {t("Registered player")}
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", borderTop: "1px solid #e6ecf1" }}>
          {[
            ["42", t("Matches")],
            ["1,284", t("Runs")],
            ["37", t("Wickets")],
          ].map(([value, label], i) => (
            <Box key={label} sx={{ py: 1, textAlign: "center", borderLeft: i ? "1px solid #e6ecf1" : "none" }}>
              <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: 17, lineHeight: 1.1 }}>{value}</Typography>
              <Typography sx={{ fontSize: 9.5, fontWeight: 800, color: "#6b7785", textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ px: 2, pt: 1.25, pb: 1.5, borderTop: "1px solid #e6ecf1" }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#5b6976" }}>{t("Last 8 innings")}</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#0b7f61" }}>SR 138.4</Typography>
          </Stack>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: "6px", height: 40 }}>
            {[22, 8, 45, 31, 71, 12, 38, 54].map((runs, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${(runs / 71) * 100}%`,
                  minHeight: 3,
                  borderRadius: "4px 4px 0 0",
                  background: runs >= 50 ? "var(--app-accent-start, #43cea2)" : "var(--app-accent-end, #185a9d)",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 1.25,
          mx: "auto",
          width: "fit-content",
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderRadius: 99,
          background: "#fff",
          boxShadow: "0 6px 16px rgba(12,53,88,0.12)",
          fontSize: 12.5,
          fontWeight: 800,
          color: NAVY,
        }}
      >
        <LinkRounded sx={{ fontSize: 17, color: "var(--app-accent-end, #185a9d)" }} />
        cricket-score-counter.com/u/aarav.k
      </Box>
    </Box>
  );
};

/** What running a tournament looks like: live match + its watch link, table, leader. */
const TournamentPreview: React.FC = () => {
  const { t } = useTranslation();
  const table = [
    ["Pune Panthers", 4, 4, 8],
    ["Kothrud Kings", 4, 3, 6],
    ["Baner Blasters", 4, 1, 2],
    ["Aundh Avengers", 4, 0, 0],
  ] as const;
  return (
    <Box aria-hidden sx={{ width: "100%", maxWidth: 320, mx: "auto" }}>
      <Box sx={{ borderRadius: 4, overflow: "hidden", background: "#fff", boxShadow: "0 16px 36px rgba(12,53,88,0.18)" }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.75, py: 1.25, background: ACCENT_GRADIENT, color: "#fff" }}>
          <EmojiEventsRounded sx={{ fontSize: 20 }} />
          <Typography sx={{ fontWeight: 900, fontSize: 14.5 }}>Pune Premier League</Typography>
        </Stack>
        {/* Live match */}
        <Box sx={{ px: 1.75, py: 1.25, borderBottom: "1px solid #e6ecf1" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ fontSize: 10.5, fontWeight: 900, color: "#fff", background: "#e0463c", borderRadius: 99, px: 0.9, py: 0.15 }}>● {t("LIVE")}</Box>
            <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: "#6b7785" }}>{t("Over")} 9.2 / 10</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 0.75 }}>
            <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: 14 }}>Pune Panthers</Typography>
            <Typography sx={{ fontWeight: 900, color: NAVY, fontSize: 17 }}>84/3</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, color: "#6b7785", fontWeight: 700 }}>vs Kothrud Kings · {t("need 7 off 4")}</Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              px: 1,
              py: 0.6,
              borderRadius: 2,
              background: "color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #ffffff 86%)",
              fontSize: 11.5,
              fontWeight: 800,
              color: NAVY,
            }}
          >
            <IosShareRounded sx={{ fontSize: 15 }} /> {t("Watch link copied: anyone can follow live")}
          </Box>
        </Box>
        {/* Points table */}
        <Box sx={{ px: 1.75, pt: 1, pb: 0.5 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 28px 28px 34px", fontSize: 10, fontWeight: 900, color: "#8a96a3", textTransform: "uppercase", pb: 0.5 }}>
            <span>{t("Team")}</span>
            <span style={{ textAlign: "center" }}>P</span>
            <span style={{ textAlign: "center" }}>W</span>
            <span style={{ textAlign: "right" }}>{t("Pts")}</span>
          </Box>
          {table.map(([team, played, won, pts], i) => (
            <Box
              key={team}
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 28px 28px 34px",
                py: 0.6,
                borderTop: "1px solid #eef2f5",
                fontSize: 12.5,
                fontWeight: i === 0 ? 900 : 700,
                color: NAVY,
              }}
            >
              <span>{i + 1}. {team}</span>
              <span style={{ textAlign: "center" }}>{played}</span>
              <span style={{ textAlign: "center" }}>{won}</span>
              <span style={{ textAlign: "right" }}>{pts}</span>
            </Box>
          ))}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1.75, py: 1, borderTop: "1px solid #e6ecf1", background: "#f8fbfc" }}>
          <InsightsRounded sx={{ fontSize: 17, color: "var(--app-accent-end, #185a9d)" }} />
          <Typography sx={{ fontSize: 12, fontWeight: 800, color: NAVY }}>
            {t("Most runs")}: Aarav K · 212
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

/**
 * Home-page showcase of player profiles, stats and tournaments. Visitors
 * pick "I play" or "I organize" and see just what matters to them, with a
 * preview of what they'd get and one clear next step.
 *
 * The first render is the same for everyone (so it matches the prerendered
 * HTML); who's viewing is worked out after mount and only changes buttons.
 */
const PlayerFeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [viewer, setViewer] = React.useState<Viewer>("anonymous");
  const [persona, setPersona] = React.useState<Persona>("player");

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

  const steps = [
    { n: 1, title: t("Score ball by ball"), body: t("Quick taps on any phone") },
    { n: 2, title: t("Stats build themselves"), body: t("Scorecards, tables, career records") },
    { n: 3, title: t("Share one link"), body: t("Fans watch live, players show their record") },
  ];

  const content =
    persona === "player"
      ? {
          kicker: t("For players"),
          title: t("A cricket profile that follows you to every match"),
          benefits: [
            { icon: <InsightsRounded />, title: t("Career stats, automatically"), body: t("Runs, average, strike rate, wickets and economy from every tournament and friendly.") },
            { icon: <BadgeRounded />, title: t("Your profile, your way"), body: t("Photo, role, batting and bowling style. Organizers find you by @username.") },
            { icon: <PersonSearchRounded />, title: t("Claim your past matches"), body: t("Played before you joined? Link the records organizers already made for you.") },
            { icon: <IosShareRounded />, title: t("One link to show it off"), body: t("Send your stats card on WhatsApp, or keep your profile private.") },
          ],
          preview: <ProfilePreview />,
        }
      : {
          kicker: t("For organizers & scorers"),
          title: t("Run a whole tournament from your phone"),
          benefits: [
            { icon: <GroupAddRounded />, title: t("Squads in seconds"), body: t("Search registered players or reuse saved teams. Players get notified.") },
            { icon: <EmojiEventsRounded />, title: t("Tables & leaders, automatic"), body: t("Points table, most runs, most wickets and best partnerships update after every match.") },
            { icon: <LinkRounded />, title: t("A live link for every match"), body: t("Share it once. Anyone can watch ball by ball, no app or login needed.") },
            { icon: <TimerRounded />, title: t("Built for real grounds"), body: t("Rain delay? Change the overs mid-innings. Lost signal? Viewers catch up when you're back.") },
          ],
          preview: <TournamentPreview />,
        };

  const primaryCta =
    persona === "player" ? (
      viewer === "has-profile" ? (
        <Button onClick={() => navigate("/me")} sx={primaryButtonSx}>{t("View my profile")}</Button>
      ) : viewer === "no-profile" ? (
        <Button onClick={() => navigate("/me?welcome=player")} sx={primaryButtonSx}>{t("Create my player profile")}</Button>
      ) : (
        <Button data-ga-click="home_join_as_player" onClick={() => startAs(navigate, "player")} sx={primaryButtonSx}>
          {t("Create your player profile")}
        </Button>
      )
    ) : (
      <Button
        data-ga-click="home_join_as_organizer"
        onClick={() => (viewer === "anonymous" ? startAs(navigate, "organizer") : navigate("/tournaments"))}
        sx={primaryButtonSx}
      >
        {t("Start a tournament")}
      </Button>
    );

  return (
    <Box
      component="section"
      aria-labelledby="player-features-heading"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        px: { xs: 1.5, sm: 3 },
        pt: { xs: 3, sm: 4.5 },
        pb: { xs: 2, sm: 3 },
        background: "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1040 }}>
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: { xs: 2.25, sm: 3 } }}>
          <Box
            component="span"
            sx={{ display: "inline-block", px: 1.25, py: 0.35, mb: 1.25, borderRadius: 99, fontSize: "calc(12px * var(--app-font-scale, 1))", fontWeight: 900, letterSpacing: 0.6, color: NAVY, background: "#ffe39a" }}
          >
            {t("NEW")}
          </Box>
          <Typography
            id="player-features-heading"
            component="h2"
            sx={{ fontWeight: 900, color: "#fff", fontSize: { xs: "calc(26px * var(--app-font-scale, 1))", sm: "calc(36px * var(--app-font-scale, 1))" }, lineHeight: 1.12 }}
          >
            {t("Every ball you score now becomes stats")}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.86)", mt: 1, maxWidth: 600, mx: "auto", fontWeight: 600, fontSize: { xs: "calc(14.5px * var(--app-font-scale, 1))", sm: "calc(16.5px * var(--app-font-scale, 1))" } }}>
            {t("Player profiles, career records and tournaments that run themselves.")}
          </Typography>
        </Box>

        {/* How it works */}
        <Box
          component="ol"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            mb: { xs: 2.5, sm: 3 },
            display: "grid",
            gap: { xs: 1, sm: 1.5 },
            gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" },
          }}
        >
          {steps.map((step) => (
            <Box
              component="li"
              key={step.n}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.75,
                py: 1.25,
                borderRadius: 3,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Box sx={{ flex: "none", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 900, color: NAVY, background: "#fff" }}>
                {step.n}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, color: "#fff", fontSize: "calc(14.5px * var(--app-font-scale, 1))", lineHeight: 1.25 }}>{step.title}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "calc(12.5px * var(--app-font-scale, 1))", fontWeight: 600 }}>{step.body}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Persona switch */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
          <Box
            role="tablist"
            aria-label={t("Show features for")}
            sx={{ display: "inline-grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", p: 0.5, borderRadius: 99, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            {(
              [
                { id: "player", label: t("I play"), icon: <SportsCricketRounded sx={{ fontSize: 18 }} /> },
                { id: "organizer", label: t("I organize"), icon: <EmojiEventsRounded sx={{ fontSize: 18 }} /> },
              ] as const
            ).map((tab) => {
              const active = persona === tab.id;
              return (
                <Box
                  key={tab.id}
                  component="button"
                  type="button"
                  role="tab"
                  id={`features-tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls="features-panel"
                  data-ga-click={`home_features_${tab.id}`}
                  onClick={() => setPersona(tab.id)}
                  sx={{
                    all: "unset",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.75,
                    px: { xs: 2.25, sm: 3 },
                    py: 1,
                    borderRadius: 99,
                    fontWeight: 900,
                    fontSize: "calc(14.5px * var(--app-font-scale, 1))",
                    color: active ? NAVY : "#fff",
                    background: active ? "#fff" : "transparent",
                    boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                    transition: "background .15s, color .15s",
                    "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 2 },
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Panel */}
        <Box
          id="features-panel"
          role="tabpanel"
          aria-labelledby={`features-tab-${persona}`}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "1.15fr 0.85fr" },
          }}
        >
          <Box sx={{ p: { xs: 2.25, sm: 3.5 } }}>
            <Typography sx={{ fontWeight: 900, fontSize: "calc(12.5px * var(--app-font-scale, 1))", letterSpacing: 0.6, textTransform: "uppercase", color: "var(--app-accent-end, #185a9d)" }}>
              {content.kicker}
            </Typography>
            <Typography component="h3" sx={{ fontWeight: 900, color: NAVY, fontSize: { xs: "calc(21px * var(--app-font-scale, 1))", sm: "calc(25px * var(--app-font-scale, 1))" }, lineHeight: 1.2, mt: 0.5, mb: 2.5 }}>
              {content.title}
            </Typography>
            <Box sx={{ display: "grid", gap: 2.25, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" } }}>
              {content.benefits.map((b) => (
                <Benefit key={b.title} icon={b.icon} title={b.title} body={b.body} />
              ))}
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 3 }} alignItems={{ xs: "stretch", sm: "center" }}>
              {primaryCta}
              <Button onClick={() => navigate("/create-game")} sx={secondaryButtonSx}>
                {t("Score a match now")}
              </Button>
            </Stack>
            {viewer === "anonymous" && (
              <Typography sx={{ mt: 1.5, color: MUTED, fontSize: "calc(13px * var(--app-font-scale, 1))", fontWeight: 600 }}>
                {t("Already have an account?")}{" "}
                <Box
                  component="button"
                  type="button"
                  onClick={() => startAs(navigate, persona, "login")}
                  sx={{ all: "unset", cursor: "pointer", color: "var(--app-accent-end, #185a9d)", fontWeight: 900, textDecoration: "underline" }}
                >
                  {t("Log in")}
                </Box>
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 2.5, sm: 3.5 },
              background:
                "linear-gradient(160deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #ffffff 86%) 0%, color-mix(in srgb, var(--app-accent-end, #185a9d) 12%, #ffffff 88%) 100%)",
            }}
          >
            {content.preview}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerFeaturesSection;
