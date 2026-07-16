import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Map, Save, Shield, Trash2, Trophy } from "lucide-react";
import type { ClassicMapResult, Group, Player, ScoringConfig } from "../../lib/types";
import { getPoints, uid } from "../../lib/utils";

type DraftEntry = {
  groupId: string;
  kills: number;
  placement: number;
};

type Props = {
  tournamentId: string;
  groups: Group[];
  players: Player[];
  scoring: ScoringConfig;
  results: ClassicMapResult[];
  onSave: (result: ClassicMapResult) => void;
  onDelete: (id: string) => void;
};

export default function ClassicResultsPanel({
  tournamentId,
  groups,
  players,
  scoring,
  results,
  onSave,
  onDelete,
}: Props) {
  const [mapName, setMapName] = useState("Erangel");
  const [entries, setEntries] = useState<DraftEntry[]>(() =>
    groups.map((group, index) => ({
      groupId: group.id,
      kills: 0,
      placement: index + 1,
    }))
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("");

  const toggleExpand = (groupId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const leaderboard = useMemo(() => {
    return groups
      .map((group) => {
        const groupEntries = results.flatMap((result) =>
          result.entries.filter((entry) => entry.groupId === group.id)
        );
        const kills = groupEntries.reduce((total, entry) => total + entry.kills, 0);
        const pts = groupEntries.reduce(
          (total, entry) => total + getPoints(entry.kills, entry.placement, scoring),
          0
        );
        return { ...group, maps: groupEntries.length, kills, pts };
      })
      .sort((a, b) => b.pts - a.pts || b.kills - a.kills);
  }, [groups, results, scoring]);

  const updateEntry = (
    groupId: string,
    field: "kills" | "placement",
    value: number
  ) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.groupId === groupId
          ? { ...entry, [field]: Math.max(field === "placement" ? 1 : 0, value) }
          : entry
      )
    );
  };

  const saveResult = () => {
    if (!groups.length) return;
    onSave({
      id: uid("map"),
      tournamentId,
      mapName: mapName.trim() || "Xarita",
      matchNumber: results.length + 1,
      entries,
    });
    setNotice("Xarita natijasi saqlandi. Leaderboard yangilandi.");
    window.setTimeout(() => setNotice(""), 2200);
  };

  return (
    <div className="space-y-6">
      {/* ── Entry panel ── */}
      <section className="rounded-xl border border-primary/20 bg-primary/[.045] p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-wider">
              <Map size={16} className="text-primary" />
              Classic — xarita natijasi
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Har map tugagach kamanda kill va Top o&apos;rnini kiriting. PTS avtomatik yig&apos;iladi.
            </p>
          </div>
          {notice && (
            <span className="font-mono text-[10px] text-emerald-400">{notice}</span>
          )}
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
            placeholder="Xarita nomi"
          />
          <button
            onClick={saveResult}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-wider text-primary-foreground"
          >
            <Save size={15} />
            Natijani saqlash
          </button>
        </div>

        {!groups.length ? (
          <p className="py-4 font-mono text-sm text-muted-foreground">
            Avval Guruhlar &amp; O&apos;yinchilar bo&apos;limida kamandalarni qo&apos;shing.
          </p>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-[1fr_100px_100px_90px] gap-3 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Kamanda</span>
              <span>Kill</span>
              <span>Top o&apos;rin</span>
              <span>PTS</span>
            </div>

            {groups.map((group) => {
              const entry = entries.find((e) => e.groupId === group.id);
              if (!entry) return null;
              const pts = getPoints(entry.kills, entry.placement, scoring);
              const isOpen = expanded.has(group.id);
              const groupPlayers = players.filter((p) => p.groupId === group.id);

              return (
                <div key={group.id} className="rounded-lg border border-border/60 bg-secondary/30 overflow-hidden">
                  {/* Team row */}
                  <div className="grid grid-cols-[1fr_100px_100px_90px] items-center gap-3 px-3 py-2.5">
                    {/* Team name — clickable to expand */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(group.id)}
                      className="flex items-center gap-2 text-left min-w-0"
                    >
                      {isOpen ? (
                        <ChevronDown size={13} className="text-primary flex-shrink-0" />
                      ) : (
                        <ChevronRight size={13} className="text-muted-foreground flex-shrink-0" />
                      )}
                      <Shield size={11} className="text-primary/60 flex-shrink-0" />
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-mono text-primary flex-shrink-0">
                        {group.tag}
                      </span>
                      <span className="font-['Barlow_Condensed'] font-semibold tracking-wide truncate">
                        {group.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">
                        {groupPlayers.length} o&apos;yinchi
                      </span>
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={entry.kills}
                      onChange={(e) => updateEntry(group.id, "kills", Number(e.target.value))}
                      className="w-full rounded border border-border bg-secondary px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none"
                    />
                    <input
                      type="number"
                      min="1"
                      value={entry.placement}
                      onChange={(e) => updateEntry(group.id, "placement", Number(e.target.value))}
                      className="w-full rounded border border-border bg-secondary px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none"
                    />
                    <span className="font-mono text-sm font-bold text-primary">{pts}</span>
                  </div>

                  {/* Expanded players list */}
                  {isOpen && (
                    <div className="border-t border-border/40 bg-secondary/20">
                      {groupPlayers.length === 0 ? (
                        <div className="px-8 py-3 font-mono text-[11px] text-muted-foreground italic">
                          Bu kamandada o&apos;yinchi yo&apos;q
                        </div>
                      ) : (
                        groupPlayers.map((player, idx) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-2 px-8 py-2 border-b border-border/30 last:border-0"
                          >
                            <span className="font-mono text-[10px] text-muted-foreground w-5 flex-shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="font-['Barlow_Condensed'] text-sm tracking-wide">
                              {player.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Leaderboard ── */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Trophy size={16} className="text-primary" />
          <h2 className="font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-wider">
            Avto leaderboard
          </h2>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            {results.length} MAP
          </span>
        </div>
        {leaderboard.map((group, index) => (
          <div
            key={group.id}
            className="grid grid-cols-[42px_1fr_70px_70px_82px] items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0"
          >
            <span
              className={`font-mono font-bold ${index < 3 ? "text-primary" : "text-muted-foreground"}`}
            >
              #{index + 1}
            </span>
            <span className="font-['Barlow_Condensed'] font-bold tracking-wide">
              <span className="text-primary">[{group.tag}]</span> {group.name}
              <span className="block font-mono text-[10px] font-normal text-muted-foreground">
                {group.maps} map
              </span>
            </span>
            <span className="font-mono text-xs">{group.kills}K</span>
            <span className="font-mono text-xs text-muted-foreground">{group.maps} O&apos;YIN</span>
            <span className="text-right font-mono text-base font-bold text-primary">{group.pts}</span>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="px-5 py-10 text-center font-mono text-sm text-muted-foreground">
            Kamandalar hali qo&apos;shilmagan.
          </div>
        )}
      </section>

      {/* ── Saved maps ── */}
      {results.length > 0 && (
        <section className="space-y-2 rounded-xl border border-border bg-card p-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Saqlangan xaritalar
          </span>
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between border-t border-border/60 pt-2"
            >
              <span className="font-mono text-xs">
                #{result.matchNumber} · {result.mapName}
              </span>
              <button
                onClick={() => onDelete(result.id)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`${result.mapName} natijasini o'chirish`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
