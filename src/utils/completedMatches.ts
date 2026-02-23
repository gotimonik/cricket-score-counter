import type { BallEvent, ScoreState } from "../types/cricket";

export interface MatchInningSummary {
  battingTeam: string;
  runs: number;
  wickets: number;
  overs: string;
}

export interface CompletedMatchRecord {
  id: string;
  savedAt: string;
  teams: string[];
  winningTeam: string;
  winType: "runs" | "wickets" | "tie" | "unknown";
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
  event.type !== "wide" && event.extra_type !== "no-ball-extra";

const toOvers = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

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
  };
};

const getPlural = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

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
    const teamPlayers = snapshot.playerRosterByTeam?.[winningTeam]?.length ?? 11;
    const wicketsRemaining = Math.max(teamPlayers - 1 - secondInnings.wickets, 0);
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
  const [team1 = "", team2 = ""] = snapshot.teams;
  const innings = [
    summarizeInning(team1, snapshot.recentEventsByTeams ?? {}),
    summarizeInning(team2, snapshot.recentEventsByTeams ?? {}),
  ];
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
