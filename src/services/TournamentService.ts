import AuthService from "./AuthService";
import type {
  TournamentMatch,
  TournamentMatchCompletionInput,
  TournamentMatchInput,
  TournamentInput,
  TournamentRecord,
  TournamentTeam,
  TournamentTeamInput,
  TournamentTeamStatistics,
  TournamentUpdateInput,
} from "../types/tournament";

type TournamentsResponse = {
  tournaments: TournamentRecord[];
  data?: unknown;
};

type TournamentResponse = {
  tournament: TournamentRecord;
  data?: unknown;
};

type TournamentTeamResponse = {
  team: TournamentTeam;
  tournament?: TournamentRecord;
  data?: unknown;
};

type TournamentTeamsResponse = {
  teams: TournamentTeam[];
  data?: unknown;
};

type TournamentMatchResponse = {
  match: TournamentMatch;
  tournamentMatch?: TournamentMatch;
  data?: unknown;
};

type MessageResponse = {
  message?: string;
};

type TournamentStatisticsSyncResponse = {
  message?: string;
  tournament?: TournamentRecord;
  teams?: TournamentTeam[];
  data?: unknown;
};

const defaultTeamStatistics: TournamentTeamStatistics = {
  matchesPlayed: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  noResults: 0,
  points: 0,
  runsFor: 0,
  runsAgainst: 0,
  wicketsTaken: 0,
  wicketsLost: 0,
  ballsFaced: 0,
  ballsBowled: 0,
  netRunRate: 0,
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const asStringDate = (value: unknown, fallback: string) => {
  if (typeof value !== "string" || !value) return fallback;
  return value.slice(0, 10);
};

const normalizeTeam = (teamValue: unknown): TournamentTeam => {
  const team = asRecord(teamValue);
  const stats = asRecord(team.stats);
  const statisticsRecord = asRecord(team.statistics);
  const players = Array.isArray(team.players) ? team.players : [];
  const now = new Date().toISOString();
  const statistics: TournamentTeamStatistics = {
    matchesPlayed: asNumber(
      statisticsRecord.matchesPlayed ?? stats.played ?? team.played,
      defaultTeamStatistics.matchesPlayed,
    ),
    wins: asNumber(
      statisticsRecord.wins ?? stats.won ?? team.won,
      defaultTeamStatistics.wins,
    ),
    losses: asNumber(
      statisticsRecord.losses ?? stats.lost ?? team.lost,
      defaultTeamStatistics.losses,
    ),
    ties: asNumber(statisticsRecord.ties, defaultTeamStatistics.ties),
    noResults: asNumber(
      statisticsRecord.noResults,
      defaultTeamStatistics.noResults,
    ),
    points: asNumber(
      statisticsRecord.points ?? stats.points ?? team.points,
      defaultTeamStatistics.points,
    ),
    runsFor: asNumber(statisticsRecord.runsFor, defaultTeamStatistics.runsFor),
    runsAgainst: asNumber(
      statisticsRecord.runsAgainst,
      defaultTeamStatistics.runsAgainst,
    ),
    wicketsTaken: asNumber(
      statisticsRecord.wicketsTaken,
      defaultTeamStatistics.wicketsTaken,
    ),
    wicketsLost: asNumber(
      statisticsRecord.wicketsLost,
      defaultTeamStatistics.wicketsLost,
    ),
    ballsFaced: asNumber(
      statisticsRecord.ballsFaced,
      defaultTeamStatistics.ballsFaced,
    ),
    ballsBowled: asNumber(
      statisticsRecord.ballsBowled,
      defaultTeamStatistics.ballsBowled,
    ),
    netRunRate: asNumber(
      statisticsRecord.netRunRate ??
        stats.netRunRate ??
        stats.net_run_rate ??
        team.netRunRate ??
        team.net_run_rate,
      defaultTeamStatistics.netRunRate,
    ),
  };

  return {
    id: asString(team.id, createId("team")),
    tournamentId: asString(team.tournamentId ?? team.tournament_id),
    name: asString(team.name, "Untitled Team"),
    logoUrl: asString(team.logoUrl ?? team.logo_url),
    captainName: asString(team.captainName ?? team.captain_name),
    contactNumber: asString(team.contactNumber ?? team.contact_number),
    players: players.map((playerValue) => {
      const player = asRecord(playerValue);
      return {
        id: asString(player.id, createId("player")),
        name: asString(player.name, "Unnamed Player"),
        role: asString(player.role),
        contactNumber: asString(player.contactNumber ?? player.contact_number),
      };
    }),
    playerCount: asNumber(team.playerCount ?? team.player_count, players.length),
    stats: {
      played: asNumber(stats.played, statistics.matchesPlayed),
      won: asNumber(stats.won, statistics.wins),
      lost: asNumber(stats.lost, statistics.losses),
      points: asNumber(stats.points, statistics.points),
      netRunRate: asNumber(stats.netRunRate ?? stats.net_run_rate, statistics.netRunRate),
    },
    statistics,
    createdAt: asString(team.createdAt ?? team.created_at, now),
    updatedAt: asString(team.updatedAt ?? team.updated_at, now),
  };
};

const normalizeTournamentMatch = (matchValue: unknown): TournamentMatch => {
  const match = asRecord(matchValue);
  const now = new Date().toISOString();

  return {
    id: asString(match.id, createId("tournament-match")),
    tournamentId: asString(match.tournamentId ?? match.tournament_id),
    team1Id: asString(match.team1Id ?? match.team1_id),
    team2Id: asString(match.team2Id ?? match.team2_id),
    team1Name: asString(match.team1Name ?? match.team1_name),
    team2Name: asString(match.team2Name ?? match.team2_name),
    status:
      match.status === "in_progress" || match.status === "completed"
        ? match.status
        : "scheduled",
    winnerTeamId: asString(match.winnerTeamId ?? match.winner_team_id),
    winnerTeamName: asString(match.winnerTeamName ?? match.winner_team_name),
    resultText: asString(match.resultText ?? match.result_text),
    scorerMatchId: asString(match.scorerMatchId ?? match.scorer_match_id),
    snapshot:
      match.snapshot && typeof match.snapshot === "object"
        ? (match.snapshot as TournamentMatch["snapshot"])
        : null,
    startedAt: asString(match.startedAt ?? match.started_at),
    completedAt: asString(match.completedAt ?? match.completed_at),
    createdAt: asString(match.createdAt ?? match.created_at, now),
    updatedAt: asString(match.updatedAt ?? match.updated_at, now),
  };
};

const normalizeTournament = (
  tournamentValue: unknown,
): TournamentRecord => {
  const tournament = asRecord(tournamentValue);
  const teams = Array.isArray(tournament.teams) ? tournament.teams : [];
  const matches = Array.isArray(tournament.matches) ? tournament.matches : [];
  const now = new Date().toISOString();

  return {
    id: asString(tournament.id, createId("tournament")),
    name: asString(tournament.name, "Untitled Tournament"),
    organizerName: asString(
      tournament.organizerName ?? tournament.organizer_name,
    ),
    startDate: asStringDate(tournament.startDate ?? tournament.start_date, now),
    endDate: asStringDate(tournament.endDate ?? tournament.end_date, now),
    location: asString(tournament.location),
    logoUrl: asString(tournament.logoUrl ?? tournament.logo_url),
    ballType:
      tournament.ballType === "leather" ||
      tournament.ballType === "custom" ||
      tournament.ball_type === "leather" ||
      tournament.ball_type === "custom"
        ? ((tournament.ballType ?? tournament.ball_type) as
            | "leather"
            | "custom")
        : "tennis",
    customBallType: asString(
      tournament.customBallType ?? tournament.custom_ball_type,
    ),
    oversPerMatch: Math.max(
      1,
      asNumber(tournament.oversPerMatch ?? tournament.overs_per_match, 10),
    ),
    format:
      tournament.format === "knockout" ? "knockout" : "league",
    status:
      tournament.status === "active" || tournament.status === "completed"
        ? tournament.status
        : "draft",
    squadMode:
      tournament.squadMode === "with_players" ||
      tournament.squad_mode === "with_players"
        ? "with_players"
        : "teams_only",
    teamsCount: asNumber(tournament.teamsCount ?? tournament.teams_count, teams.length),
    teams: teams.map(normalizeTeam),
    matches: matches.map(normalizeTournamentMatch),
    createdAt: asString(tournament.createdAt ?? tournament.created_at, now),
    updatedAt: asString(tournament.updatedAt ?? tournament.updated_at, now),
  };
};

const normalizeTournaments = (value: unknown): TournamentRecord[] =>
  Array.isArray(value) ? value.map(normalizeTournament) : [];

const extractTournaments = (value: unknown) => {
  const response = asRecord(value);
  return normalizeTournaments(
    response.tournaments ?? response.data ?? response.items ?? value,
  );
};

const extractTournament = (value: unknown) => {
  const response = asRecord(value);
  return normalizeTournament(response.tournament ?? response.data ?? value);
};

const extractTeam = (value: unknown) => {
  const response = asRecord(value);
  return normalizeTeam(response.team ?? response.data ?? value);
};

const extractTeams = (value: unknown) => {
  const response = asRecord(value);
  const teams = response.teams ?? response.data ?? value;
  return Array.isArray(teams) ? teams.map(normalizeTeam) : [];
};

const extractMatch = (value: unknown) => {
  const response = asRecord(value);
  return normalizeTournamentMatch(
    response.match ?? response.tournamentMatch ?? response.data ?? value,
  );
};

const requireLoggedIn = () => {
  if (!AuthService.isLoggedIn()) {
    throw new Error("Please login to use tournament features.");
  }
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

export const TournamentService = {
  getTournaments: async () => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentsResponse>(
      "/tournaments",
      { method: "GET" },
    );
    return extractTournaments(data);
  },

  getTournament: async (id: string) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentResponse>(
      `/tournaments/${encodeURIComponent(id)}`,
      { method: "GET" },
    );
    return extractTournament(data);
  },

  createTournament: async (input: TournamentInput) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentResponse>(
      "/tournaments",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    return extractTournament(data);
  },

  updateTournament: async (id: string, input: TournamentUpdateInput) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentResponse>(
      `/tournaments/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
    );
    return extractTournament(data);
  },

  deleteTournament: async (id: string) => {
    requireLoggedIn();

    return AuthService.request<MessageResponse>(
      `/tournaments/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },

  getTeams: async (tournamentId: string) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentTeamsResponse>(
      `/tournaments/${encodeURIComponent(tournamentId)}/teams`,
      { method: "GET" },
    );
    return extractTeams(data);
  },

  addTeam: async (tournamentId: string, input: TournamentTeamInput) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentTeamResponse>(
      `/tournaments/${encodeURIComponent(tournamentId)}/teams`,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    return extractTeam(data);
  },

  updateTeam: async (
    tournamentId: string,
    teamId: string,
    input: Partial<TournamentTeamInput>,
  ) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentTeamResponse>(
      `/tournaments/${encodeURIComponent(
        tournamentId,
      )}/teams/${encodeURIComponent(teamId)}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      },
    );
    return extractTeam(data);
  },

  updateTeamPlayers: async (
    tournamentId: string,
    teamId: string,
    players: TournamentTeamInput["players"],
  ) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentTeamResponse>(
      `/tournaments/${encodeURIComponent(
        tournamentId,
      )}/teams/${encodeURIComponent(teamId)}/players`,
      {
        method: "PUT",
        body: JSON.stringify({ players }),
      },
    );
    return extractTeam(data);
  },

  updateTeamStatistics: async (
    tournamentId: string,
    teamId: string,
    statistics: Partial<TournamentTeamStatistics>,
  ) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentTeamResponse>(
      `/tournaments/${encodeURIComponent(
        tournamentId,
      )}/teams/${encodeURIComponent(teamId)}/statistics`,
      {
        method: "PATCH",
        body: JSON.stringify({ statistics }),
      },
    );
    return extractTeam(data);
  },

  syncStatistics: async (tournamentId: string) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentStatisticsSyncResponse>(
      `/tournaments/${encodeURIComponent(tournamentId)}/statistics/sync`,
      { method: "POST" },
    );
    return extractTournament(data);
  },

  deleteTeam: async (tournamentId: string, teamId: string) => {
    requireLoggedIn();

    return AuthService.request<MessageResponse>(
      `/tournaments/${encodeURIComponent(
        tournamentId,
      )}/teams/${encodeURIComponent(teamId)}`,
      { method: "DELETE" },
    );
  },

  startMatch: async (tournamentId: string, input: TournamentMatchInput) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentMatchResponse>(
      `/tournaments/${encodeURIComponent(tournamentId)}/matches/start`,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    return extractMatch(data);
  },

  completeMatch: async (
    tournamentId: string,
    matchId: string,
    input: TournamentMatchCompletionInput,
  ) => {
    requireLoggedIn();

    const data = await AuthService.request<TournamentMatchResponse>(
      `/tournaments/${encodeURIComponent(
        tournamentId,
      )}/matches/${encodeURIComponent(matchId)}/complete`,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    return extractMatch(data);
  },
};

export default TournamentService;
