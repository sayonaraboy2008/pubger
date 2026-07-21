import { useState, useEffect } from "react";
import { Crosshair, Search, SlidersHorizontal, X, ShoppingCart } from "lucide-react";
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
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Show ad after a short delay on first visit
    const timer = setTimeout(() => setShowAd(true), 500);
    return () => clearTimeout(timer);
  }, []);

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
      {/* UC Service Ad Modal */}
      {showAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-[#151518] border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(242,169,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Close button */}
            <button 
              onClick={() => setShowAd(false)}
              className="absolute top-3 right-3 text-black hover:text-white bg-white/20 hover:bg-white/40 rounded-full transition-colors p-1.5 z-10"
              aria-label="Yopish"
            >
              <X size={16} />
            </button>
            
            {/* Header/Banner */}
            <div className="bg-gradient-to-br from-primary to-primary/60 p-6 pt-8 flex flex-col items-center justify-center text-black relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <ShoppingCart size={100} />
              </div>
              <ShoppingCart size={36} className="mb-3 drop-shadow-md" />
              <h3 className="font-['Barlow_Condensed'] font-extrabold text-3xl uppercase tracking-wider text-center leading-tight drop-shadow-sm">
                Eng Ishonchli va<br/>Tezkor UC Service
              </h3>
            </div>
            
            {/* Body */}
            <div className="p-6 text-center flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed font-mono">
                Akkountingiz uchun UC kerakmi? O'zbekistondagi eng ishonchli va arzon xizmatdan foydalaning!
              </p>
              
              <div className="bg-primary/10 border border-primary/30 rounded-xl py-3 px-4 mb-6 w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                <p className="text-primary font-['Barlow_Condensed'] font-bold text-sm uppercase tracking-widest relative z-10">
                  🎁 Bizning nomimizdan xarid qilsangiz maxsus chegirma!
                </p>
              </div>
              
              <a 
                href="https://t.me/pubger_uz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowAd(false)}
                className="w-full bg-primary hover:bg-primary/90 text-black font-['Barlow_Condensed'] font-bold text-xl uppercase tracking-widest py-3.5 rounded-xl shadow-[0_4px_20px_rgba(242,169,0,0.4)] hover:shadow-[0_4px_30px_rgba(242,169,0,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                UC Xarid Qilish
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative border-b border-primary/20 overflow-hidden bg-black/40">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(242,169,0,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid pattern for gaming look */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-primary rounded-sm shadow-[0_0_10px_rgba(242,169,0,0.8)]" />
            <span className="text-sm font-mono text-primary tracking-[0.3em] uppercase font-bold drop-shadow-md">
              O&apos;zbekiston · PUBG Mobile
            </span>
          </div>
          <h1 className="font-['Barlow_Condensed'] font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-widest uppercase text-white leading-[0.9] mb-6 drop-shadow-xl">
            Battle Royale
            <br />
            <span className="text-primary drop-shadow-[0_0_15px_rgba(242,169,0,0.5)]">Turnir Platformasi</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed border-l-2 border-primary/50 pl-4 bg-primary/5 py-2 rounded-r">
            PUBG Mobile turnirlarini kuzatib boring — guruh natijalari, bracket va g&apos;oliblar real vaqtda yangilanib turadi. O'z jamoangizni g'alaba sari yetaklang!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: data.tournaments.length, label: "Jami Turnirlar" },
              { value: data.tournaments.filter((t) => t.status === "ongoing").length, label: "Faol Turnirlar" },
              { value: data.players.length, label: "Ro'yxatdan o'tganlar" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col bg-secondary/40 border border-primary/10 rounded-lg p-4 backdrop-blur-sm shadow-lg min-w-[140px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 group-hover:bg-primary transition-colors"></div>
                <span className="font-['Barlow_Condensed'] font-extrabold text-4xl text-white group-hover:text-primary transition-colors leading-none drop-shadow-md">
                  {s.value}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-2 font-semibold">
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
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
            <input
              className="w-full bg-secondary/80 border border-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              placeholder="Turnir qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1.5 bg-secondary/80 rounded-lg border border-primary/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] w-full sm:w-auto overflow-x-auto">
            <SlidersHorizontal size={14} className="text-primary mx-2 flex-shrink-0" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded text-[13px] font-['Barlow_Condensed'] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                  filter === f.value
                    ? "bg-primary text-black shadow-[0_0_10px_rgba(242,169,0,0.4)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
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
