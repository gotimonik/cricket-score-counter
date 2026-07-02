import type { PlayerRosterByTeam, ScoreState } from "../types/cricket";
import {
  getCompletedMatchById,
  getCompletedMatches,
} from "../utils/completedMatches";
import AuthService from "./AuthService";

export type SavedMatchStatus = "in_progress" | "completed";

export interface SavedMatchRecord {
  id: string;
  clientMatchId: string;
  tournamentId?: string;
  tournamentMatchId?: string;
  isTournamentMatch?: boolean;
  tournamentName?: string;
  tournamentLogoUrl?: string;
  source?: string;
  teams: string[];
  winningTeam: string;
  status: SavedMatchStatus;
  resultText: string;
  snapshot: ScoreState;
  savedAt: string;
}

type PlayersResponse = {
  playersByTeam: PlayerRosterByTeam;
};

type MatchesResponse = {
  matches: SavedMatchRecord[];
};

type MatchResponse = {
  match: SavedMatchRecord;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback: string | undefined = "") =>
  typeof value === "string" ? value : fallback;

const LOCAL_PLAYERS_KEY = "cricket-team-players";
const LOCAL_SAVED_MATCHES_KEY = "cricket-local-saved-matches";

const getLocalJson = <T>(key: string, fallback: T): T => {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalJson = (key: string, value: unknown) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage may be unavailable in private modes.
  }
};

const toRosterPayload = (playersByTeam: PlayerRosterByTeam) => ({
  teams: Object.entries(playersByTeam).map(([teamName, players]) => ({
    teamName,
    players,
  })),
});

const getLocalPlayers = (teams?: string[]): PlayerRosterByTeam => {
  const allPlayers = getLocalJson<PlayerRosterByTeam>(LOCAL_PLAYERS_KEY, {});
  if (!teams?.length) return allPlayers;

  return teams.reduce<PlayerRosterByTeam>((acc, team) => {
    if (team && allPlayers[team]) {
      acc[team] = allPlayers[team];
    }
    return acc;
  }, {});
};

const saveLocalPlayers = (playersByTeam: PlayerRosterByTeam) => {
  const current = getLocalPlayers();
  const next = {
    ...current,
    ...playersByTeam,
  };
  setLocalJson(LOCAL_PLAYERS_KEY, next);
  return next;
};

const toSavedMatchRecord = ({
  id,
  clientMatchId,
  snapshot,
  status,
  resultText = "",
  savedAt = new Date().toISOString(),
  tournamentId,
  tournamentMatchId,
  isTournamentMatch,
  tournamentName,
  tournamentLogoUrl,
  source,
}: {
  id: string;
  clientMatchId: string;
  snapshot: ScoreState;
  status: SavedMatchStatus;
  resultText?: string;
  savedAt?: string;
  tournamentId?: string;
  tournamentMatchId?: string;
  isTournamentMatch?: boolean;
  tournamentName?: string;
  tournamentLogoUrl?: string;
  source?: string;
}): SavedMatchRecord => ({
  id,
  clientMatchId,
  tournamentId,
  tournamentMatchId,
  isTournamentMatch,
  tournamentName,
  tournamentLogoUrl,
  source,
  teams: snapshot.teams,
  winningTeam: snapshot.winningTeam,  
  status,
  resultText,
  snapshot,
  savedAt,
});

const hasValidTeamNames = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length >= 2 &&
  Boolean(value[0]) &&
  Boolean(value[1]);

const normalizeSavedMatch = (value: unknown): SavedMatchRecord => {
  const match = asRecord(value);
  const snapshot = asRecord(match.snapshot) as unknown as ScoreState;
  const topLevelTeams = Array.isArray(match.teams)
    ? (match.teams as string[])
    : [];
  const team1Team2 = [
    asString(match.team1Name, ""),
    asString(match.team2Name, ""),
  ];
  // Snapshot teams are only trustworthy when both names are populated;
  // tournament in-progress snapshots often send ["", ""] here, in which
  // case we should fall back to the top-level team names from the API.
  const teams = hasValidTeamNames(snapshot.teams)
    ? snapshot.teams
    : hasValidTeamNames(topLevelTeams)
      ? topLevelTeams
      : hasValidTeamNames(team1Team2)
        ? team1Team2
        : (snapshot.teams ?? topLevelTeams);
  const now = new Date().toISOString();
  const source = asString(match.source, undefined);
  const tournamentId = asString(
    match.tournamentId ?? match.tournament_id,
    undefined,
  );
  const isTournamentMatch =
    match.isTournamentMatch === true ||
    match.is_tournament_match === true ||
    source === "tournament" ||
    Boolean(tournamentId);

  return {
    id: asString(match.id, asString(match.clientMatchId ?? match.client_match_id)),
    clientMatchId: asString(
      match.clientMatchId ?? match.client_match_id,
      asString(match.id),
    ),
    tournamentId,
    tournamentMatchId: asString(
      match.tournamentMatchId ?? match.tournament_match_id,
      undefined,
    ),
    isTournamentMatch,
    tournamentName: asString(
      match.tournamentName ?? match.tournament_name,
      undefined,
    ),
    tournamentLogoUrl: asString(
      match.tournamentLogoUrl ?? match.tournament_logo_url,
      undefined,
    ),
    source,
    teams,
    winningTeam: asString(match.winningTeam ?? match.winning_team),
    status: match.status === "completed" ? "completed" : "in_progress",
    resultText: asString(match.resultText ?? match.result_text),
    // Keep snapshot.teams in sync with the resolved team names so any
    // consumer reading match.snapshot.teams directly also sees the fix.
    snapshot: { ...snapshot, teams },
    savedAt: asString(match.savedAt ?? match.saved_at ?? match.updatedAt, now),
  };
};

const getLocalSavedMatches = (): SavedMatchRecord[] => {
  const activeMatches = getLocalJson<SavedMatchRecord[]>(
    LOCAL_SAVED_MATCHES_KEY,
    [],
  );
  const completedMatches = getCompletedMatches().map((match) =>
    toSavedMatchRecord({
      id: match.id,
      clientMatchId: match.id,
      snapshot: match.snapshot,
      status: "completed",
      resultText: match.resultText,
      savedAt: match.savedAt,
    }),
  );

  return [...activeMatches, ...completedMatches];
};

const getLocalSavedMatch = (id: string) =>
  getLocalSavedMatches().find(
    (match) => match.id === id || match.clientMatchId === id,
  ) ??
  (() => {
    const completed = getCompletedMatchById(id);
    return completed
      ? toSavedMatchRecord({
          id: completed.id,
          clientMatchId: completed.id,
          snapshot: completed.snapshot,
          status: "completed",
          resultText: completed.resultText,
          savedAt: completed.savedAt,
        })
      : undefined;
  })();

const saveLocalMatch = ({
  clientMatchId,
  tournamentId,
  tournamentMatchId,
  snapshot,
  status,
  resultText,
}: {
  clientMatchId: string;
  tournamentId?: string;
  tournamentMatchId?: string;
  snapshot: ScoreState;
  status: SavedMatchStatus;
  resultText: string;
}) => {
  const existingMatches = getLocalJson<SavedMatchRecord[]>(
    LOCAL_SAVED_MATCHES_KEY,
    [],
  );
  const existingIndex = existingMatches.findIndex(
    (match) => match.clientMatchId === clientMatchId,
  );
  const existingMatch = existingIndex >= 0 ? existingMatches[existingIndex] : null;
  const record = toSavedMatchRecord({
    id: existingMatch?.id ?? clientMatchId,
    clientMatchId,
    tournamentId,
    tournamentMatchId,
    snapshot,
    status,
    resultText,
  });
  const nextMatches =
    existingIndex >= 0
      ? existingMatches.map((match, index) =>
          index === existingIndex ? record : match,
        )
      : [record, ...existingMatches];

  setLocalJson(LOCAL_SAVED_MATCHES_KEY, nextMatches);
  return record;
};

export const PlayerMatchService = {
  getPlayers: async (teams?: string[]) => {
    if (!AuthService.isLoggedIn()) {
      return getLocalPlayers(teams);
    }

    const query =
      teams && teams.length
        ? `?teams=${encodeURIComponent(teams.filter(Boolean).join(","))}`
        : "";
    const data = await AuthService.request<PlayersResponse>(
      `/players${query}`,
      { method: "GET" },
    );
    return data.playersByTeam ?? {};
  },

  savePlayers: async (playersByTeam: PlayerRosterByTeam) => {
    if (!AuthService.isLoggedIn()) {
      return saveLocalPlayers(playersByTeam);
    }

    const data = await AuthService.request<PlayersResponse>("/players", {
      method: "POST",
      body: JSON.stringify(toRosterPayload(playersByTeam)),
    });
    return data.playersByTeam ?? {};
  },

  getMatches: async () => {
    if (!AuthService.isLoggedIn()) {
      return getLocalSavedMatches();
    }

    const data = await AuthService.request<MatchesResponse>("/matches", {
      method: "GET",
    });
    return (data.matches ?? []).map(normalizeSavedMatch);
  },

  getMatch: async (id: string) => {
    if (!AuthService.isLoggedIn()) {
      const match = getLocalSavedMatch(id);
      if (!match) {
        throw new Error("Match not found");
      }
      return match;
    }

    const data = await AuthService.request<MatchResponse>(
      `/matches/${encodeURIComponent(id)}`,
      { method: "GET" },
    );
    return normalizeSavedMatch(data.match);
  },

  saveMatch: async ({
    clientMatchId,
    tournamentId,
    tournamentMatchId,
    snapshot,
    status = "in_progress",
    resultText = "",
  }: {
    clientMatchId: string;
    tournamentId?: string;
    tournamentMatchId?: string;
    snapshot: ScoreState;
    status?: SavedMatchStatus;
    resultText?: string;
  }) => {
    if (!AuthService.isLoggedIn()) {
      return saveLocalMatch({
        clientMatchId,
        tournamentId,
        tournamentMatchId,
        snapshot,
        status,
        resultText,
      });
    }

    const data = await AuthService.request<MatchResponse>("/matches", {
      method: "POST",
      body: JSON.stringify({
        clientMatchId,
        tournamentId,
        tournamentMatchId,
        teams: snapshot.teams,
        status,
        resultText,
        snapshot,
      }),
    });
    return data.match;
  },
};

export default PlayerMatchService;
