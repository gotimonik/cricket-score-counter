import type { BallEvent, MatchLengthMode, ScoreState } from "../types/cricket";

export interface MatchInningSummary {
  battingTeam: string;
  runs: number;
  wickets: number;
  overs: string;
  balls: number;
  // Set only on a Super Over's own mini-innings, appended after the two
  // regulation innings when the match was decided by one or more Super
  // Overs -- lets the UI label these distinctly instead of a 3rd/4th
  // entry being mislabeled as another regulation innings.
  phase?: "super-over";
  superOverNumber?: number;
}

export interface CompletedMatchRecord {
  id: string;
  savedAt: string;
  teams: string[];
  winningTeam: string;
  winType: "runs" | "wickets" | "tie" | "super-over" | "unknown";
  winBy: number;
  resultText: string;
  innings: MatchInningSummary[];
  snapshot: ScoreState;
}

const COMPLETED_MATCHES_KEY = "cricket-completed-matches";
const MAX_COMPLETED_MATCHES = 100;

const getEventTotalRuns = (event: BallEvent) =>
  event.extra_type === "no-ball-extra" ? event.value + 1 : event.value;

const isLegalDelivery = (event: BallEvent) =>
  event.type !== "wide" &&
  event.type !== "no-ball" &&
  event.type !== "no-ball-extra" &&
  event.type !== "penalty" &&
  event.extra_type !== "no-ball-extra";

const toOvers = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

// Shared by every place that renders an innings summary (match history,
// recent matches, saved-match viewer): shows the classic "X.Y" overs
// notation for "by overs" matches, or a plain ball count for "by balls"
// matches, since fractional-over notation doesn't map cleanly onto a ball
// count that may not be a multiple of 6.
export const formatInningsOvers = (
  balls: number,
  matchLengthMode?: MatchLengthMode,
): string => (matchLengthMode === "balls" ? `${balls} balls` : toOvers(balls));

const summarizeInning = (
  battingTeam: string,
  recentEventsByTeams: { [team: string]: { [key: number]: BallEvent[] } }
): MatchInningSummary => {
  const overs = recentEventsByTeams[battingTeam] ?? {};
  let runs = 0;
  let wickets = 0;
  let legalBalls = 0;

  Object.values(overs).forEach((events) => {
    events.forEach((event) => {
      if (event.type === "wicket") wickets += 1;
      runs += getEventTotalRuns(event);
      if (isLegalDelivery(event)) legalBalls += 1;
    });
  });

  return {
    battingTeam,
    runs,
    wickets,
    overs: toOvers(legalBalls),
    balls: legalBalls,
  };
};

const getPlural = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

// Shared by every place that shows a full innings-by-innings breakdown
// (the saved-match viewer today) -- the two regulation innings, plus each
// Super Over's own mini-innings tacked on afterward when the match went
// to one or more of them, so a tie decided by a Super Over doesn't just
// disappear from the detailed scorecard once the one-line result text is
// past you.
export const buildInningsSummaries = (
  snapshot: ScoreState,
): MatchInningSummary[] => {
  const [team1 = "", team2 = ""] = snapshot.teams;
  const innings: MatchInningSummary[] = [
    summarizeInning(team1, snapshot.recentEventsByTeams ?? {}),
    summarizeInning(team2, snapshot.recentEventsByTeams ?? {}),
  ];

  (snapshot.superOvers ?? []).forEach((superOver, index) => {
    const [superTeam1 = "", superTeam2 = ""] = superOver.teams;
    const superOverEvents = superOver.recentEventsByTeams ?? {};
    innings.push(
      {
        ...summarizeInning(superTeam1, superOverEvents),
        phase: "super-over",
        superOverNumber: index + 1,
      },
      {
        ...summarizeInning(superTeam2, superOverEvents),
        phase: "super-over",
        superOverNumber: index + 1,
      },
    );
  });

  return innings;
};

const getWinningSummary = (
  snapshot: ScoreState,
  innings: MatchInningSummary[],
  winningTeam: string
): Pick<CompletedMatchRecord, "winType" | "winBy" | "resultText"> => {
  const firstInnings = innings[0];
  const secondInnings = innings[1];

  if (!winningTeam || winningTeam === "Tied") {
    return {
      winType: "tie",
      winBy: 0,
      resultText: "Match tied",
    };
  }

  // The regulation match (the fields summarized in `innings`) ended tied and
  // one or more super overs decided it — describe the result in terms of the
  // final, decisive super over rather than as a plain runs/wickets margin
  // over the regulation innings (which would be misleading, since those two
  // innings were already level).
  const decidingSuperOver = snapshot.superOvers?.[snapshot.superOvers.length - 1];
  if (decidingSuperOver && decidingSuperOver.winningTeam === winningTeam) {
    const superOverInnings = [
      summarizeInning(
        decidingSuperOver.teams[0] ?? "",
        decidingSuperOver.recentEventsByTeams ?? {},
      ),
      summarizeInning(
        decidingSuperOver.teams[1] ?? "",
        decidingSuperOver.recentEventsByTeams ?? {},
      ),
    ];
    const superOverMargin = getWinningSummary(
      {
        ...snapshot,
        superOvers: undefined,
        playerRosterByTeam:
          decidingSuperOver.playerRosterByTeam ?? snapshot.playerRosterByTeam,
      },
      superOverInnings,
      winningTeam,
    );
    return {
      winType: "super-over",
      winBy: superOverMargin.winBy,
      resultText:
        superOverMargin.resultText === "Match tied"
          ? `Match tied. Scores level after the Super Over — ${winningTeam} won.`
          : `Match tied. ${winningTeam} won the Super Over (${superOverMargin.resultText}).`,
    };
  }

  if (!firstInnings || !secondInnings) {
    return {
      winType: "unknown",
      winBy: 0,
      resultText: `${winningTeam} won`,
    };
  }

  if (winningTeam === firstInnings.battingTeam) {
    const runs = Math.max(firstInnings.runs - secondInnings.runs, 0);
    return {
      winType: "runs",
      winBy: runs,
      resultText: `${winningTeam} won by ${getPlural(runs, "run", "runs")}`,
    };
  }

  if (winningTeam === secondInnings.battingTeam) {
    const teamPlayers = snapshot.playerRosterByTeam?.[winningTeam]?.length || 11;
    const wicketsRemaining = Math.max((teamPlayers) - 1 - secondInnings.wickets, 0);
    return {
      winType: "wickets",
      winBy: wicketsRemaining,
      resultText: `${winningTeam} won by ${getPlural(
        wicketsRemaining,
        "wicket",
        "wickets"
      )}`,
    };
  }

  return {
    winType: "unknown",
    winBy: 0,
    resultText: `${winningTeam} won`,
  };
};

export const getWinningSummaryFromSnapshot = (
  snapshot: ScoreState,
  winningTeam: string
): Pick<CompletedMatchRecord, "winType" | "winBy" | "resultText"> => {
  const [team1 = "", team2 = ""] = snapshot.teams;
  const innings = [
    summarizeInning(team1, snapshot.recentEventsByTeams ?? {}),
    summarizeInning(team2, snapshot.recentEventsByTeams ?? {}),
  ];
  return getWinningSummary(snapshot, innings, winningTeam);
};

export const getCompletedMatches = (): CompletedMatchRecord[] => {
  try {
    const raw = localStorage.getItem(COMPLETED_MATCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CompletedMatchRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCompletedMatchById = (
  id: string
): CompletedMatchRecord | undefined => getCompletedMatches().find((m) => m.id === id);

export const saveCompletedMatch = (
  snapshot: ScoreState,
  winningTeam: string
): CompletedMatchRecord => {
  const innings = buildInningsSummaries(snapshot);
  const winningSummary = getWinningSummary(snapshot, innings, winningTeam);

  const record: CompletedMatchRecord = {
    id: `M-${Date.now().toString(36).toUpperCase()}`,
    savedAt: new Date().toISOString(),
    teams: snapshot.teams,
    winningTeam,
    winType: winningSummary.winType,
    winBy: winningSummary.winBy,
    resultText: winningSummary.resultText,
    innings,
    snapshot,
  };

  const matches = [record, ...getCompletedMatches()].slice(0, MAX_COMPLETED_MATCHES);
  localStorage.setItem(COMPLETED_MATCHES_KEY, JSON.stringify(matches));
  return record;
};
