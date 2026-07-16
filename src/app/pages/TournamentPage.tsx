import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ChevronLeft,
  Swords,
  LayoutGrid,
  Star,
  Crosshair,
} from "lucide-react";
import { useStore } from "../../lib/store";
import { statusLabel, statusColor } from "../../lib/utils";
import BracketView from "../components/BracketView";
import GroupsView from "../components/GroupsView";
import type { ScoringConfig } from "../../lib/types";
import ClassicLeaderboard from "../components/ClassicLeaderboard";

type PageTab = "bracket" | "groups" | "leaderboard" | "scoring";

// ─── Scoring Table ────────────────────────────────────────────────────────────
function ScoringTable({ scoring }: { scoring: ScoringConfig }) {
  const positions = scoring.placementPts.map((pts, i) => ({ pos: i + 1, pts }));
  const top3 = positions.slice(0, 3);
  const top10 = positions.slice(3, 10);
  const rest = positions.slice(10).filter((p) => p.pts > 0);

  const tierBg = ["bg-amber-400/10 border-amber-400/25", "bg-primary/10 border-primary/20", "bg-muted/50 border-border"];

  const Section = ({
    label,
    labelColor,
    items,
    tier,
  }: {
    label: string;
    labelColor: string;
    items: typeof top3;
    tier: number;
  }) => (
    <div className={`rounded-lg border p-4 ${tierBg[tier]}`}>
      <div className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${labelColor}`}>
        {label}
      </div>
      <div className="space-y-1.5">
        {items.map(({ pos, pts }) => (
          <div key={pos} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pos <= 3 && (
                <span className="text-xs">
                  {pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉"}
                </span>
              )}
              {pos > 3 && (
                <span className="text-xs font-mono text-muted-foreground w-6 text-center">
                  #{pos}
                </span>
              )}
              <span className="text-sm font-['Barlow_Condensed'] tracking-wide text-foreground">
                {pos}. o&apos;rin
              </span>
            </div>
            <span
              className={`font-mono text-sm font-semibold ${
                pos <= 3
                  ? "text-amber-400"
                  : pos <= 10
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {pts} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Kill points */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair size={18} className="text-primary" />
          <div>
            <div className="text-sm font-['Barlow_Condensed'] font-bold tracking-wide text-foreground">
              Kill ballari
            </div>
            <div className="text-xs text-muted-foreground font-mono">Har bir kill uchun</div>
          </div>
        </div>
        <span className="font-mono text-2xl font-bold text-primary">×{scoring.killPts}</span>
      </div>

      {/* Placement tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Section label="🏆 Top 3" labelColor="text-amber-400" items={top3} tier={0} />
        <Section
          label="🎯 Top 4–10"
          labelColor="text-primary/80"
          items={top10}
          tier={1}
        />
        {rest.length > 0 ? (
          <Section label="📊 11+" labelColor="text-muted-foreground" items={rest} tier={2} />
        ) : (
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              📊 11+
            </div>
            <div className="text-sm text-muted-foreground font-mono text-center py-4">
              0 pts
            </div>
          </div>
        )}
      </div>

      {/* Formula */}
      <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
        <p className="text-xs font-mono text-muted-foreground">
          <span className="text-foreground font-semibold">Formula:</span>{" "}
          Jami ball = Kill × {scoring.killPts} + O&apos;rin bali
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useStore();
  const [tab, setTab] = useState<PageTab>("bracket");

  const tournament = data.tournaments.find((t) => t.id === id);
  const groups = data.groups.filter((g) => g.tournamentId === id);
  const players = data.players.filter((p) => p.tournamentId === id);
  const matches = data.matches.filter((m) => m.tournamentId === id);
  const classicResults = data.classicResults.filter((r) => r.tournamentId === id);
  const scoring = tournament?.scoring;

  useEffect(() => {
    if (tournament?.mode === "classic") setTab("leaderboard");
    else setTab("bracket");
  }, [id, tournament?.mode]);

  if (!tournament) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground font-mono text-sm mb-4">Turnir topilmadi</p>
        <Link to="/" className="text-primary text-sm font-mono hover:underline">← Orqaga</Link>
      </div>
    );
  }

  const tabs: Array<{ key: PageTab; label: string; icon: React.ReactNode }> = tournament.mode === "classic"
    ? [
        { key: "leaderboard", label: "Leaderboard", icon: <Trophy size={14} /> },
        { key: "groups", label: "Kamandalar", icon: <LayoutGrid size={14} /> },
        { key: "scoring", label: "Scoring", icon: <Star size={14} /> },
      ]
    : [
        { key: "bracket", label: "Bracket", icon: <Swords size={14} /> },
        { key: "groups", label: "Guruhlar", icon: <LayoutGrid size={14} /> },
        { key: "scoring", label: "Scoring", icon: <Star size={14} /> },
      ];

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ChevronLeft size={13} />
            Barcha turnirlar
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <Trophy size={26} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded border ${statusColor[tournament.status]}`}>
                  {statusLabel[tournament.status]}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{tournament.game} · {tournament.mode === "classic" ? "CLASSIC" : "TDM"}</span>
              </div>
              <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-foreground leading-tight mb-2">
                {tournament.name}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
                {tournament.description}
              </p>
              <div className="flex flex-wrap gap-5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Calendar size={11} />
                  <span>{tournament.startDate} — {tournament.endDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <MapPin size={11} />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-primary">
                  <Trophy size={11} />
                  <span>{tournament.prizePool}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Users size={11} />
                  <span>{players.length} o&apos;yinchi</span>
                </div>
                {scoring && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                    <Crosshair size={11} />
                    <span>Kill ×{scoring.killPts}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-['Barlow_Condensed'] font-semibold tracking-wider uppercase border-b-2 transition-all -mb-px ${
                  tab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {tab === "leaderboard" && tournament.mode === "classic" && (
          <ClassicLeaderboard groups={groups} results={classicResults} scoring={scoring} />
        )}

        {tab === "bracket" && (
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-6">
              Chorak finaldan grand finalga qadar · g&apos;oliblar avtomatik keyingi bosqichga o&apos;tadi
            </p>
            {matches.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground font-mono text-sm">
                Bracket hali sozlanmagan
              </div>
            ) : (
              <BracketView matches={matches} players={players} scoring={scoring} />
            )}
          </div>
        )}

        {tab === "groups" && (
          <GroupsView groups={groups} players={players} scoring={scoring} showScores={tournament.mode !== "classic"} />
        )}

        {tab === "scoring" && scoring && (
          <div className="max-w-2xl">
            <h2 className="font-['Barlow_Condensed'] font-extrabold text-xl tracking-wider uppercase text-foreground mb-6">
              Ball Tizimi
            </h2>
            <ScoringTable scoring={scoring} />
          </div>
        )}
      </div>
    </div>
  );
}
