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

const BG_IMAGES = [
  "https://w0.peakpx.com/wallpaper/403/92/HD-wallpaper-pubg-mobile-season-13-pubg-mobile-season-13-pubg-mobile-games.jpg",
  "https://w0.peakpx.com/wallpaper/559/134/HD-wallpaper-pubg-mobile-pubg-thumbnail.jpg",
  "https://w0.peakpx.com/wallpaper/950/758/HD-wallpaper-pubg-mobile-4th-anniversary-colorful.jpg",
  "https://w0.peakpx.com/wallpaper/317/472/HD-wallpaper-pubg-mobile-1-9-update.jpg"
];

export default function Home() {
  const { data } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TournamentStatus | "all">("all");
  const [showAd, setShowAd] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    // Show ad after a short delay on first visit
    const adTimer = setTimeout(() => setShowAd(true), 1500);
    
    // Background slider
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);

    return () => {
      clearTimeout(adTimer);
      clearInterval(bgTimer);
    };
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
          <div className="relative w-full max-w-sm bg-card border-2 border-primary/50 rounded-2xl shadow-[0_0_60px_rgba(242,169,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 isolate">
            {/* Pulsing glow behind content */}
            <div className="absolute inset-0 bg-primary/10 blur-xl animate-pulse -z-10" />
            
            {/* Close button */}
            <button 
              onClick={() => setShowAd(false)}
              className="absolute top-3 right-3 text-black/70 hover:text-black bg-white/30 hover:bg-white/60 dark:text-white/70 dark:hover:text-white dark:bg-black/30 dark:hover:bg-black/60 rounded-full transition-colors p-1.5 z-20"
              aria-label="Yopish"
            >
              <X size={16} />
            </button>
            
            {/* Header/Banner */}
            <div className="bg-gradient-to-br from-primary to-primary/60 p-6 pt-8 flex flex-col items-center justify-center text-black relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 animate-pulse">
                <ShoppingCart size={100} />
              </div>
              <ShoppingCart size={36} className="mb-3 drop-shadow-md text-black" />
              <h3 className="font-['Barlow_Condensed'] font-extrabold text-3xl uppercase tracking-wider text-center leading-tight drop-shadow-sm text-black">
                Eng Ishonchli va<br/>Tezkor UC Service
              </h3>
            </div>
            
            {/* Body */}
            <div className="p-6 text-center flex flex-col items-center bg-card relative z-10">
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed font-mono">
                Akkountingiz uchun UC kerakmi? O'zbekistondagi eng ishonchli va arzon xizmatdan foydalaning!
              </p>
              
              <div className="bg-primary/10 border border-primary/30 rounded-xl py-3 px-4 mb-6 w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                <p className="text-primary font-['Barlow_Condensed'] font-bold text-[15px] uppercase tracking-widest relative z-10 animate-pulse">
                  🎁 Bizning nomimizdan xarid qilsangiz maxsus chegirma!
                </p>
              </div>
              
              <a 
                href="https://t.me/Namangan_scrims"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowAd(false)}
                className="w-full bg-primary hover:bg-primary/90 text-black font-['Barlow_Condensed'] font-bold text-xl uppercase tracking-widest py-3.5 rounded-xl shadow-[0_4px_20px_rgba(242,169,0,0.5)] hover:shadow-[0_4px_30px_rgba(242,169,0,0.8)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                UC Xarid Qilish
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative border-b border-primary/20 overflow-hidden bg-background min-h-[450px] flex items-center">
        {/* Background Slider */}
        {BG_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${bgIndex === idx ? 'opacity-30 dark:opacity-40' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Dark/Light overlay for text readability */}
        <div className="absolute inset-0 bg-background/80 dark:bg-black/60 pointer-events-none" />

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
          <h1 className="font-['Barlow_Condensed'] font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-widest uppercase text-foreground leading-[0.9] mb-6 drop-shadow-xl">
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
                <span className="font-['Barlow_Condensed'] font-extrabold text-4xl text-foreground group-hover:text-primary transition-colors leading-none drop-shadow-md">
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
              className="w-full bg-secondary/80 border border-primary/20 rounded-lg pl-10 pr-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-[0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              placeholder="Turnir qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1.5 bg-secondary/80 rounded-lg border border-primary/20 shadow-[0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)] w-full sm:w-auto overflow-x-auto">
            <SlidersHorizontal size={14} className="text-primary mx-2 flex-shrink-0" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded text-[13px] font-['Barlow_Condensed'] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                  filter === f.value
                    ? "bg-primary text-black shadow-[0_0_10px_rgba(242,169,0,0.4)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
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
