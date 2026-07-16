import { useState } from "react";
import { Crown } from "lucide-react";
import type { BracketMatch, Player } from "../../lib/types";

const MATCH_H = 82;
const ROUND_LABELS = ["1-Raund", "2-Raund", "Chorak final", "Yarim final", "Grand final"];

interface Props {
  match: BracketMatch;
  players: Player[];
  isAdmin: boolean;
  onSetWinner: (matchId: string, winnerId: string, s1: number, s2: number) => void;
}

export { MATCH_H };

export default function MatchCard({ match, players, isAdmin, onSetWinner }: Props) {
  const [s1, setS1] = useState(match.score1);
  const [s2, setS2] = useState(match.score2);

  // Sync local scores when match updates
  const p1 = players.find((p) => p.id === match.player1Id);
  const p2 = players.find((p) => p.id === match.player2Id);

  const slotCls = (playerId: string | null, isWinner: boolean) =>
    [
      "flex items-center justify-between px-3 h-[36px] gap-2 text-sm transition-all",
      !playerId
        ? "text-muted-foreground/50 italic"
        : isWinner
        ? "bg-primary/10 text-primary"
        : match.winnerId && !isWinner
        ? "opacity-40"
        : "text-foreground hover:bg-secondary/40",
    ].join(" ");

  return (
    <div
      className="w-full rounded overflow-hidden border border-border bg-card"
      style={{ height: MATCH_H }}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between px-3 py-[3px] bg-secondary/80 border-b border-border">
        <span className="text-[9px] font-mono text-muted-foreground tracking-[0.18em] uppercase">
          {ROUND_LABELS[match.round] ?? `${match.round + 1}-Raund`}
        </span>
        {match.winnerId && (
          <span className="text-[9px] font-mono text-primary tracking-wide">✓ TUGADI</span>
        )}
      </div>

      {/* Slot 1 */}
      <div className={slotCls(match.player1Id, match.winnerId === match.player1Id)}>
        <div className="flex items-center gap-1.5 min-w-0">
          {match.winnerId === match.player1Id && <Crown size={11} className="text-primary flex-shrink-0" />}
          <span className="truncate font-['Barlow_Condensed'] text-[14px] tracking-wide">
            {p1?.name ?? "—"}
          </span>
        </div>
        {isAdmin && p1 && !match.winnerId ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              className="w-8 text-center text-xs bg-muted rounded border border-border font-mono py-0.5 focus:outline-none focus:border-primary/50"
              value={s1}
              type="number"
              min={0}
              onChange={(e) => setS1(Number(e.target.value))}
            />
            <button
              className="text-[9px] px-1.5 py-0.5 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors font-mono uppercase tracking-wide"
              onClick={() => onSetWinner(match.id, match.player1Id!, s1, s2)}
            >
              G&apos;alaba
            </button>
          </div>
        ) : (match.score1 > 0 || match.score2 > 0) ? (
          <span className="font-mono text-xs text-muted-foreground flex-shrink-0">{match.score1}</span>
        ) : null}
      </div>

      <div className="h-px bg-border" />

      {/* Slot 2 */}
      <div className={slotCls(match.player2Id, match.winnerId === match.player2Id)}>
        <div className="flex items-center gap-1.5 min-w-0">
          {match.winnerId === match.player2Id && <Crown size={11} className="text-primary flex-shrink-0" />}
          <span className="truncate font-['Barlow_Condensed'] text-[14px] tracking-wide">
            {p2?.name ?? "—"}
          </span>
        </div>
        {isAdmin && p2 && !match.winnerId ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              className="w-8 text-center text-xs bg-muted rounded border border-border font-mono py-0.5 focus:outline-none focus:border-primary/50"
              value={s2}
              type="number"
              min={0}
              onChange={(e) => setS2(Number(e.target.value))}
            />
            <button
              className="text-[9px] px-1.5 py-0.5 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors font-mono uppercase tracking-wide"
              onClick={() => onSetWinner(match.id, match.player2Id!, s1, s2)}
            >
              G&apos;alaba
            </button>
          </div>
        ) : (match.score1 > 0 || match.score2 > 0) ? (
          <span className="font-mono text-xs text-muted-foreground flex-shrink-0">{match.score2}</span>
        ) : null}
      </div>
    </div>
  );
}
