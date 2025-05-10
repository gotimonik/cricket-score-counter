import type { Match } from "../types/cricket";

// This service would handle saving/loading match data
export class MatchService {
  private static STORAGE_KEY = "cricket_matches";

  static saveMatch(match: Match): void {
    const matches = this.getMatches();
    const existingIndex = matches.findIndex((m) => m.id === match.id);

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

  static getMatch(id: string): Match | undefined {
    const matches = this.getMatches();
    return matches.find((m) => m.id === id);
  }

  static deleteMatch(id: string): void {
    const matches = this.getMatches().filter((m) => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matches));
  }

  static createNewMatch(team1: string, team2: string): Match {
    return {
      id: Date.now().toString(),
      team1,
      team2,
      score: 0,
      wickets: 0,
      overs: 0,
      events: [],
    };
  }
}
