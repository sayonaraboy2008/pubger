export type TournamentStatus = "upcoming" | "ongoing" | "completed";
export type TournamentMode = "tdm" | "classic";
export type TdmFormat = "1v1" | "2v2" | "3v3" | "4v4";

export interface ScoringConfig {
  killPts: number;
  placementPts: number[]; // index 0 = 1st place, up to 20 positions
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  prizePool: string;
  location: string;
  createdAt: string;
  scoring: ScoringConfig;
  mode: TournamentMode;
  tdmFormat: TdmFormat;
  maxPlayers: number;
}

export interface Group {
  id: string;
  tournamentId: string;
  name: string;
  tag: string;
}

export interface Player {
  id: string;
  tournamentId: string;
  groupId: string;
  name: string;
  kills: number;
  placement: number;
}

export interface ClassicMapResult {
  id: string;
  tournamentId: string;
  mapName: string;
  matchNumber: number;
  entries: Array<{ groupId: string; kills: number; placement: number }>;
}

export interface BracketMatch {
  id: string;
  tournamentId: string;
  round: number; // 0=QF, 1=SF, 2=Final
  position: number;
  player1Id: string | null;
  player2Id: string | null;
  score1: number;
  score2: number;
  winnerId: string | null;
}

export interface AppData {
  tournaments: Tournament[];
  groups: Group[];
  players: Player[];
  matches: BracketMatch[];
  classicResults: ClassicMapResult[];
}
