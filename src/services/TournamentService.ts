import AuthService from "./AuthService";
import type {
  TournamentMatch,
  TournamentMatchCompletionInput,
  TournamentMatchInput,
  TournamentInput,
  TournamentPlayerStatistics,
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

const defaultPlayerStatistics: TournamentPlayerStatistics = {
  matchesPlayed: 0,
  runs: 0,
  ballsFaced: 0,
  fours: 0,
  sixes: 0,
  wickets: 0,
  ballsBowled: 0,
  runsConceded: 0,
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const firstValue = (
  record: Record<string, unknown>,
  keys: string[],
): unknown => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }
  return undefined;
};

const asStringDate = (value: unknown, fallback: string) => {
  if (typeof value !== "string" || !value) return fallback;
  return value.slice(0, 10);
};

const normalizeTeam = (teamValue: unknown): TournamentTeam => {
  const team = asRecord(teamValue);
  const stats = asRecord(team.stats);
  const statisticsRecord = asRecord(
    team.statistics ?? team.statistic ?? team.teamStatistics ?? team.team_statistics,
  );
  const playersValue = team.players ?? team.teamPlayers ?? team.team_players;
  const players = Array.isArray(playersValue) ? playersValue : [];
  const now = new Date().toISOString();
  const statistics: TournamentTeamStatistics = {
    matchesPlayed: asNumber(
      firstValue(statisticsRecord, ["matchesPlayed", "matches_played", "played"]) ??
        firstValue(stats, ["matchesPlayed", "matches_played", "played"]) ??
        firstValue(team, ["matchesPlayed", "matches_played", "played"]),
      defaultTeamStatistics.matchesPlayed,
    ),
    wins: asNumber(
      firstValue(statisticsRecord, ["wins", "won"]) ??
        firstValue(stats, ["wins", "won"]) ??
        firstValue(team, ["wins", "won"]),
      defaultTeamStatistics.wins,
    ),
    losses: asNumber(
      firstValue(statisticsRecord, ["losses", "lost"]) ??
        firstValue(stats, ["losses", "lost"]) ??
        firstValue(team, ["losses", "lost"]),
      defaultTeamStatistics.losses,
    ),
    ties: asNumber(
      firstValue(statisticsRecord, ["ties", "tied", "draws"]) ??
        firstValue(stats, ["ties", "tied", "draws"]) ??
        firstValue(team, ["ties", "tied", "draws"]),
      defaultTeamStatistics.ties,
    ),
    noResults: asNumber(
      firstValue(statisticsRecord, ["noResults", "no_results"]) ??
        firstValue(stats, ["noResults", "no_results"]) ??
        firstValue(team, ["noResults", "no_results"]),
      defaultTeamStatistics.noResults,
    ),
    points: asNumber(
      firstValue(statisticsRecord, ["points", "pts"]) ??
        firstValue(stats, ["points", "pts"]) ??
        firstValue(team, ["points", "pts"]),
      defaultTeamStatistics.points,
    ),
    runsFor: asNumber(
      firstValue(statisticsRecord, ["runsFor", "runs_for"]) ??
        firstValue(stats, ["runsFor", "runs_for"]) ??
        firstValue(team, ["runsFor", "runs_for"]),
      defaultTeamStatistics.runsFor,
    ),
    runsAgainst: asNumber(
      firstValue(statisticsRecord, ["runsAgainst", "runs_against"]) ??
        firstValue(stats, ["runsAgainst", "runs_against"]) ??
        firstValue(team, ["runsAgainst", "runs_against"]),
      defaultTeamStatistics.runsAgainst,
    ),
    wicketsTaken: asNumber(
      firstValue(statisticsRecord, ["wicketsTaken", "wickets_taken"]) ??
        firstValue(stats, ["wicketsTaken", "wickets_taken"]) ??
        firstValue(team, ["wicketsTaken", "wickets_taken"]),
      defaultTeamStatistics.wicketsTaken,
    ),
    wicketsLost: asNumber(
      firstValue(statisticsRecord, ["wicketsLost", "wickets_lost"]) ??
        firstValue(stats, ["wicketsLost", "wickets_lost"]) ??
        firstValue(team, ["wicketsLost", "wickets_lost"]),
      defaultTeamStatistics.wicketsLost,
    ),
    ballsFaced: asNumber(
      firstValue(statisticsRecord, ["ballsFaced", "balls_faced"]) ??
        firstValue(stats, ["ballsFaced", "balls_faced"]) ??
        firstValue(team, ["ballsFaced", "balls_faced"]),
      defaultTeamStatistics.ballsFaced,
    ),
    ballsBowled: asNumber(
      firstValue(statisticsRecord, ["ballsBowled", "balls_bowled"]) ??
        firstValue(stats, ["ballsBowled", "balls_bowled"]) ??
        firstValue(team, ["ballsBowled", "balls_bowled"]),
      defaultTeamStatistics.ballsBowled,
    ),
    netRunRate: asNumber(
      firstValue(statisticsRecord, ["netRunRate", "net_run_rate", "nrr"]) ??
        firstValue(stats, ["netRunRate", "net_run_rate", "nrr"]) ??
        firstValue(team, ["netRunRate", "net_run_rate", "nrr"]),
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
      const nestedPlayer = asRecord(player.player);
      const playerStatistics = asRecord(
        player.statistics ??
          player.statistic ??
          player.playerStatistics ??
          player.player_statistics ??
          nestedPlayer.statistics ??
          nestedPlayer.playerStatistics ??
          nestedPlayer.player_statistics ??
          player.stats,
      );
      return {
        id: asString(player.id ?? nestedPlayer.id, createId("player")),
        playerId: asString(
          player.playerId ??
            player.player_id ??
            nestedPlayer.playerId ??
            nestedPlayer.player_id,
        ),
        username: asString(player.username ?? nestedPlayer.username),
        name: asString(player.name ?? nestedPlayer.name, "Unnamed Player"),
        role: asString(player.role ?? nestedPlayer.role),
        contactNumber: asString(
          player.contactNumber ??
            player.contact_number ??
            nestedPlayer.contactNumber ??
            nestedPlayer.contact_number,
        ),
        statistics: {
          matchesPlayed: asNumber(
            firstValue(playerStatistics, [
              "matchesPlayed",
              "matches_played",
              "played",
            ]) ??
              firstValue(player, ["matchesPlayed", "matches_played"]) ??
              firstValue(nestedPlayer, ["matchesPlayed", "matches_played"]),
            defaultPlayerStatistics.matchesPlayed,
          ),
          runs: asNumber(
            firstValue(playerStatistics, ["runs"]) ?? player.runs ?? nestedPlayer.runs,
            defaultPlayerStatistics.runs,
          ),
          ballsFaced: asNumber(
            firstValue(playerStatistics, ["ballsFaced", "balls_faced"]) ??
              firstValue(player, ["ballsFaced", "balls_faced"]) ??
              firstValue(nestedPlayer, ["ballsFaced", "balls_faced"]),
            defaultPlayerStatistics.ballsFaced,
          ),
          fours: asNumber(
            firstValue(playerStatistics, ["fours", "4s"]) ??
              player.fours ??
              nestedPlayer.fours,
            defaultPlayerStatistics.fours,
          ),
          sixes: asNumber(
            firstValue(playerStatistics, ["sixes", "6s"]) ??
              player.sixes ??
              nestedPlayer.sixes,
            defaultPlayerStatistics.sixes,
          ),
          wickets: asNumber(
            firstValue(playerStatistics, ["wickets"]) ??
              player.wickets ??
              nestedPlayer.wickets,
            defaultPlayerStatistics.wickets,
          ),
          ballsBowled: asNumber(
            firstValue(playerStatistics, ["ballsBowled", "balls_bowled"]) ??
              firstValue(player, ["ballsBowled", "balls_bowled"]) ??
              firstValue(nestedPlayer, ["ballsBowled", "balls_bowled"]),
            defaultPlayerStatistics.ballsBowled,
          ),
          runsConceded: asNumber(
            firstValue(playerStatistics, ["runsConceded", "runs_conceded"]) ??
              firstValue(player, ["runsConceded", "runs_conceded"]) ??
              firstValue(nestedPlayer, ["runsConceded", "runs_conceded"]),
            defaultPlayerStatistics.runsConceded,
          ),
        },
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
  const teamsValue =
    tournament.teams ?? tournament.tournamentTeams ?? tournament.tournament_teams;
  const matchesValue =
    tournament.matches ??
    tournament.tournamentMatches ??
    tournament.tournament_matches;
  const teams = Array.isArray(teamsValue) ? teamsValue : [];
  const matches = Array.isArray(matchesValue) ? matchesValue : [];
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

const extractSyncedTournament = async (tournamentId: string, value: unknown) => {
  const response = asRecord(value);
  const tournamentValue = response.tournament ?? response.data;
  const responseData = asRecord(response.data);
  const teamsValue =
    response.teams ??
    responseData.teams ??
    (Array.isArray(response.data) ? response.data : undefined);

  if (tournamentValue && !Array.isArray(tournamentValue)) {
    const tournament = normalizeTournament(tournamentValue);
    if (teamsValue && Array.isArray(teamsValue) && tournament.teams.length === 0) {
      return {
        ...tournament,
        teams: teamsValue.map(normalizeTeam),
        teamsCount: teamsValue.length,
      };
    }
    return tournament;
  }

  if (Array.isArray(teamsValue)) {
    const tournament = await TournamentService.getTournament(tournamentId);
    const teams = teamsValue.map(normalizeTeam);
    return {
      ...tournament,
      teams,
      teamsCount: teams.length,
      updatedAt: new Date().toISOString(),
    };
  }

  return normalizeTournament(value);
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
    return extractSyncedTournament(tournamentId, data);
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
