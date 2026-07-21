import { Link } from "react-router";
import { Calendar, MapPin, Trophy, Users, ChevronRight } from "lucide-react";
import type { Tournament } from "../../lib/types";
import { statusLabel, statusColor } from "../../lib/utils";

interface Props {
  tournament: Tournament;
  playerCount: number;
}

export default function TournamentCard({ tournament: t, playerCount }: Props) {
  return (
    <Link
      to={`/tournament/${t.id}`}
      className="group flex flex-col rounded-xl border border-primary/20 bg-secondary/30 backdrop-blur-md hover:border-primary/60 hover:bg-secondary/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_15px_rgba(242,169,0,0.3)] hover:-translate-y-1 relative"
    >
      {/* Status bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all shadow-[0_0_10px_rgba(242,169,0,0.2)]">
            <Trophy size={20} className="text-primary drop-shadow-[0_0_5px_rgba(242,169,0,0.8)]" />
          </div>
          <span
            className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded border ${statusColor[t.status]}`}
          >
            {statusLabel[t.status]}
          </span>
        </div>

        {/* Title */}
        <div className="relative z-10">
          <h3 className="font-['Barlow_Condensed'] font-extrabold text-xl leading-tight tracking-widest uppercase text-white group-hover:text-primary transition-colors drop-shadow-md">
            {t.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-auto space-y-1.5 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Calendar size={11} className="flex-shrink-0" />
            <span>{t.startDate} → {t.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <MapPin size={11} className="flex-shrink-0" />
            <span>{t.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <Trophy size={11} className="flex-shrink-0" />
              <span>{t.prizePool}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Users size={11} />
              <span>{playerCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 bg-black/40 border-t border-primary/20 flex items-center justify-between relative z-10 group-hover:bg-primary/10 transition-colors">
        <span className="text-xs font-mono text-muted-foreground tracking-widest font-bold uppercase">
          {t.game}
        </span>
        <span className="flex items-center gap-1 text-xs font-['Barlow_Condensed'] text-primary/70 group-hover:text-primary transition-colors">
          Ko&apos;rish <ChevronRight size={13} />
        </span>
      </div>
    </Link>
  );
}
