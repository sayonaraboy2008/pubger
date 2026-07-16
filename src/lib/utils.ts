import type { BracketMatch, Player, ScoringConfig } from "./types";

// ─── Default / preset scoring configs ────────────────────────────────────────
export const DEFAULT_SCORING: ScoringConfig = {
  killPts: 1,
  placementPts: [10, 6, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

export const SCORING_PRESETS: Array<{ label: string; desc: string; config: ScoringConfig }> = [
  {
    label: "PUBG Standart",
    desc: "1k=10, 2k=6, 3k=5 … kill×1",
    config: {
      killPts: 1,
      placementPts: [10, 6, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    label: "Agressiv",
    desc: "1k=8, top10 pts, kill×2",
    config: {
      killPts: 2,
      placementPts: [8, 5, 4, 3, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    label: "Raqobatli",
    desc: "1k=15, top10 gacha pts, kill×1",
    config: {
      killPts: 1,
      placementPts: [15, 12, 10, 8, 6, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    label: "Maxsus",
    desc: "O'zingiz sozlang",
    config: { ...DEFAULT_SCORING },
  },
];

// ─── Point calculation ────────────────────────────────────────────────────────
export const getPoints = (
  kills: number,
  placement: number,
  config: ScoringConfig = DEFAULT_SCORING
): number => {
  const placePts = config.placementPts[placement - 1] ?? 0;
  return kills * config.killPts + placePts;
};

export const uid = (prefix = "id"): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const getPlayerName = (id: string | null, players: Player[]): string =>
  id ? (players.find((p) => p.id === id)?.name ?? "TBD") : "TBD";

export const statusLabel: Record<string, string> = {
  upcoming: "Kutilmoqda",
  ongoing: "Davom etmoqda",
  completed: "Yakunlandi",
};

export const statusColor: Record<string, string> = {
  upcoming: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  ongoing: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  completed: "text-muted-foreground bg-muted/50 border-border",
};

// Winner propagation works for 2 to 32-player knockout brackets.
export function promoteWinner(matches: BracketMatch[], matchId: string, winnerId: string, s1: number, s2: number): BracketMatch[] {
  const current = matches.find((match) => match.id === matchId);
  if (!current) return matches;
  const updated = matches.map((match) => match.id === matchId ? { ...match, winnerId, score1: s1, score2: s2 } : match);
  const nextRound = current.round + 1;
  const nextPosition = Math.floor(current.position / 2);
  const next = updated.find((match) => match.tournamentId === current.tournamentId && match.round === nextRound && match.position === nextPosition);
  if (!next) return updated;
  const slot = current.position % 2 === 0 ? "player1Id" : "player2Id";
  return updated.map((match) => match.id === next.id ? { ...match, [slot]: winnerId, score1: 0, score2: 0, winnerId: null } : match);
}

export function createMatchesForTournament(tournamentId: string, capacity = 32): BracketMatch[] {
  const size = Math.min(32, Math.max(2, 2 ** Math.ceil(Math.log2(capacity))));
  const base = { tournamentId, score1: 0, score2: 0, winnerId: null, player1Id: null, player2Id: null };
  const matches: BracketMatch[] = [];
  let matchCount = size / 2;
  let round = 0;
  while (matchCount >= 1) {
    for (let position = 0; position < matchCount; position += 1) matches.push({ ...base, id: uid("m"), round, position });
    matchCount /= 2;
    round += 1;
  }
  return matches;
}
