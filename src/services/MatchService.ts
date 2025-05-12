import type { Match } from "../types/cricket";

// This service would handle saving/loading match data
export class MatchService {
  private static STORAGE_KEY_ID = "cricket_matche_id";
  private static STORAGE_KEY = "cricket_matches";

  static saveMatch(match: Match): void {
    const matches = this.getMatches();
    const existingIndex = matches.findIndex((m) => m.id === this.getMatchId());

    if (existingIndex >= 0) {
      matches[existingIndex] = match;
    } else {
      matches.push(match);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matches));
  }

  static getMatches(): Match[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getMatch(): Match | undefined {
    const matches = this.getMatches();
    return matches.find((m) => m.id === this.getMatchId());
  }

  static deleteMatch(): void {
    const matches = this.getMatches().filter((m) => m.id !== this.getMatchId());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matches));
  }

  static generateMatchId(): string {
    const matcheID = Date.now().toString();
    localStorage.setItem(this.STORAGE_KEY_ID, matcheID);
    return matcheID;
  }

  static getMatchId(): string {
    const matcheID = localStorage.getItem(this.STORAGE_KEY_ID);
    if (matcheID) {
      return matcheID;
    }
    return this.generateMatchId();
  }

  static createNewMatch(team1: string, team2: string): Match {
    return {
      id: Date.now().toString(),
      team1,
      team2,
      score: 0,
      wickets: 0,
      targetScore: 0,
      targetOvers: 0,
      currentOver: 0,
      currentBallOfOver: 0,
      overs: 0,
      recentEvents: [],
      teams: [team1, team2],
      winningTeam: "",
      remainingBalls: 0,
    };
  }
}
