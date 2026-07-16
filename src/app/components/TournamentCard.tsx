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
      className="group flex flex-col rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-200 overflow-hidden"
    >
      {/* Status bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
            <Trophy size={18} className="text-primary" />
          </div>
          <span
            className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded border ${statusColor[t.status]}`}
          >
            {statusLabel[t.status]}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-['Barlow_Condensed'] font-bold text-lg leading-tight tracking-wide text-foreground group-hover:text-primary transition-colors">
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
      <div className="px-5 py-3 bg-secondary/40 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground tracking-wide">
          {t.game}
        </span>
        <span className="flex items-center gap-1 text-xs font-['Barlow_Condensed'] text-primary/70 group-hover:text-primary transition-colors">
          Ko&apos;rish <ChevronRight size={13} />
        </span>
      </div>
    </Link>
  );
}
