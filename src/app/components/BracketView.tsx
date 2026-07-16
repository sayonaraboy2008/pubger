import { Crown, Trophy } from "lucide-react";
import MatchCard from "./MatchCard";
import type { BracketMatch, Player, ScoringConfig } from "../../lib/types";
import { DEFAULT_SCORING } from "../../lib/utils";

interface Props {
  matches: BracketMatch[];
  players: Player[];
  isAdmin?: boolean;
  scoring?: ScoringConfig;
  onSetWinner?: (matchId: string, winnerId: string, s1: number, s2: number) => void;
}

const roundName = (round: number, totalRounds: number) => {
  const remaining = 2 ** (totalRounds - round);
  if (remaining === 2) return "GRAND FINAL";
  if (remaining === 4) return "YARIM FINAL";
  if (remaining === 8) return "CHORAK FINAL";
  return `ROUND ${round + 1}`;
};

export default function BracketView({ matches, players, isAdmin = false, onSetWinner, scoring: _scoring = DEFAULT_SCORING }: Props) {
  const rounds = [...new Set(matches.map((match) => match.round))].sort((a, b) => a - b);
  const totalRounds = rounds.length;
  const final = matches.find((match) => match.round === rounds[rounds.length - 1]);
  const champion = final?.winnerId ? players.find((player) => player.id === final.winnerId) : null;
  const setWinner = onSetWinner ?? (() => {});

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex min-w-max items-start gap-5">
        {rounds.map((round) => {
          const roundMatches = matches.filter((match) => match.round === round).sort((a, b) => a.position - b.position);
          return (
            <section key={round} className="w-56 shrink-0">
              <div className="mb-3 border-b border-border pb-2">
                <div className="font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[.18em] text-primary/80">
                  {roundName(round, totalRounds)}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">{roundMatches.length} match</div>
              </div>
              <div className="space-y-3">
                {roundMatches.map((match) => (
                  <MatchCard key={match.id} match={match} players={players} isAdmin={isAdmin} onSetWinner={setWinner} />
                ))}
              </div>
            </section>
          );
        })}
        <section className="w-36 shrink-0 pt-10">
          <div className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/[.04] p-4 text-center">
            {champion ? <><Crown size={22} className="mb-2 text-primary" /><span className="font-['Barlow_Condensed'] text-base font-bold uppercase tracking-wide">{champion.name}</span></> : <><Trophy size={20} className="mb-2 text-muted-foreground/40" /><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Chempion</span></>}
          </div>
        </section>
      </div>
    </div>
  );
}
