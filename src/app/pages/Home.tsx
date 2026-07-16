import { useState } from "react";
import { Crosshair, Search, SlidersHorizontal } from "lucide-react";
import { useStore } from "../../lib/store";
import type { TournamentStatus } from "../../lib/types";
import TournamentCard from "../components/TournamentCard";
import { statusLabel } from "../../lib/utils";

const STATUS_FILTERS: Array<{ value: TournamentStatus | "all"; label: string }> = [
  { value: "all", label: "Barchasi" },
  { value: "ongoing", label: statusLabel.ongoing },
  { value: "upcoming", label: statusLabel.upcoming },
  { value: "completed", label: statusLabel.completed },
];

export default function Home() {
  const { data } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TournamentStatus | "all">("all");

  const filtered = data.tournaments
    .filter((t) => {
      const matchSearch =
        !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filter === "all" || t.status === filter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(240,165,0,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <span className="text-xs font-mono text-primary/70 tracking-[0.25em] uppercase">
              O&apos;zbekiston · PUBG Mobile
            </span>
          </div>
          <h1 className="font-['Barlow_Condensed'] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-wider uppercase text-foreground leading-none mb-4">
            Turnir
            <br />
            <span className="text-primary">Platformasi</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
            PUBG Mobile turnirlarini kuzatib boring — guruh natijalari, bracket va g&apos;oliblar real vaqtda yangilanib turadi.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: data.tournaments.length, label: "Turnirlar" },
              { value: data.tournaments.filter((t) => t.status === "ongoing").length, label: "Faol" },
              { value: data.players.length, label: "O'yinchilar" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-['Barlow_Condensed'] font-extrabold text-3xl text-primary leading-none">
                  {s.value}
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Turnir qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border border-border">
            <SlidersHorizontal size={13} className="text-muted-foreground ml-1 flex-shrink-0" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded text-xs font-['Barlow_Condensed'] font-semibold tracking-wide transition-all ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Crosshair size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-mono text-sm">
              {search ? "Hech narsa topilmadi" : "Hali turnirlar yo'q"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                playerCount={data.players.filter((p) => p.tournamentId === t.id).length}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
