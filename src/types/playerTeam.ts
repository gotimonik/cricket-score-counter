export interface PlayerIdentity {
  id: string;
  name: string;
  username: string;
  role?: string;
  contactNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedTeamPlayer {
  id: string;
  playerId: string;
  name: string;
  username: string;
  role?: string;
  contactNumber?: string;
}

export interface SavedPlayerTeam {
  id: string;
  name: string;
  logoUrl?: string;
  captainName: string;
  contactNumber: string;
  players: SavedTeamPlayer[];
  playerCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPlayerTeamInput {
  name: string;
  logoUrl?: string;
  captainName?: string;
  contactNumber?: string;
  players: Array<{
    playerId?: string;
    name: string;
    username?: string;
    role?: string;
    contactNumber?: string;
  }>;
}
