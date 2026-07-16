import { useMemo } from "react";
import { Crosshair, Shield, Trophy } from "lucide-react";
import type { ClassicMapResult, Group, ScoringConfig } from "../../lib/types";
import { getPoints } from "../../lib/utils";

export default function ClassicLeaderboard({
  groups,
  results,
  scoring,
}: {
  groups: Group[];
  results: ClassicMapResult[];
  scoring: ScoringConfig;
}) {
  const rows = useMemo(
    () =>
      groups
        .map((group) => {
          const entries = results.flatMap((r) =>
            r.entries.filter((e) => e.groupId === group.id)
          );
          return {
            id: group.id,
            tag: group.tag,
            name: group.name,
            kills: entries.reduce((n, e) => n + e.kills, 0),
            maps: entries.length,
            pts: entries.reduce((n, e) => n + getPoints(e.kills, e.placement, scoring), 0),
          };
        })
        .sort((a, b) => b.pts - a.pts || b.kills - a.kills),
    [groups, results, scoring]
  );

  return (
    <div className="max-w-4xl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-['Barlow_Condensed'] font-extrabold text-2xl tracking-wider uppercase">
            Classic leaderboard
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Har bir xarita natijasidan avtomatik hisoblangan umumiy reyting.
          </p>
        </div>
        <span className="font-mono text-[10px] text-primary tracking-widest">
          {results.length} MAP
        </span>
      </div>

      <div className="rounded-xl overflow-hidden border border-border bg-card">
        <div className="grid grid-cols-[48px_1fr_72px_72px_90px] gap-3 bg-secondary px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>Rank</span>
          <span>Kamanda</span>
          <span>Kill</span>
          <span>Map</span>
          <span className="text-right">PTS</span>
        </div>
        {rows.length === 0 ? (
          <div className="p-10 text-center font-mono text-sm text-muted-foreground">
            Xarita natijalari hali kiritilmagan.
          </div>
        ) : (
          rows.map((row, i) => (
            <div
              key={row.id}
              className="grid grid-cols-[48px_1fr_72px_72px_90px] gap-3 px-5 py-4 border-t border-border/60 items-center"
            >
              <span
                className={`font-mono font-bold ${i < 3 ? "text-primary" : "text-muted-foreground"}`}
              >
                #{i + 1}
              </span>
              <span className="font-['Barlow_Condensed'] font-bold tracking-wide flex items-center gap-2">
                <Shield size={12} className="text-primary/60 flex-shrink-0" />
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-mono text-primary">
                  {row.tag}
                </span>
                {row.name}
                {i === 0 && <Trophy size={13} className="text-primary" />}
              </span>
              <span className="font-mono text-xs flex items-center gap-1">
                <Crosshair size={12} className="text-accent" />
                {row.kills}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{row.maps}</span>
              <span className="font-mono font-bold text-primary text-right">{row.pts}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
