import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Swords,
  LayoutGrid,
  Settings,
  RotateCcw,
  Users,
  Shield,
  Star,
  Crosshair,
  Check,
} from "lucide-react";
import { useStore } from "../../../lib/store";
import type { TournamentStatus, ScoringConfig } from "../../../lib/types";
import { statusLabel, getPoints, SCORING_PRESETS, DEFAULT_SCORING } from "../../../lib/utils";
import BracketView from "../../components/BracketView";
import ClassicResultsPanel from "../../components/ClassicResultsPanel";

type EditTab = "info" | "players" | "classic" | "bracket" | "scoring";

const inputCls =
  "bg-secondary/80 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40 w-full";

function Label({ text }: { text: string }) {
  return (
    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
      {text}
    </label>
  );
}

export default function AdminTournamentEdit() {
  const { id } = useParams<{ id: string }>();
  const {
    data,
    updateTournament,
    addGroup,
    deleteGroup,
    addPlayer,
    updatePlayer,
    deletePlayer,
    updateMatchResult,
    updateMatchParticipants,
    resetTournamentBracket,
    updateScoring,
    saveClassicMapResult,
    deleteClassicMapResult,
  } = useStore();

  const [tab, setTab] = useState<EditTab>("info");

  const tournament = data.tournaments.find((t) => t.id === id);
  const groups = data.groups.filter((g) => g.tournamentId === id);
  const players = data.players.filter((p) => p.tournamentId === id);
  const matches = data.matches.filter((m) => m.tournamentId === id);
  const classicResults = data.classicResults.filter((r) => r.tournamentId === id);

  // Info form state
  const [infoForm, setInfoForm] = useState(() =>
    tournament
      ? {
          name: tournament.name,
          description: tournament.description,
          game: tournament.game,
          mode: tournament.mode,
          tdmFormat: tournament.tdmFormat,
          maxPlayers: tournament.maxPlayers,
          status: tournament.status,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          prizePool: tournament.prizePool,
          location: tournament.location,
        }
      : null
  );

  // Player form state
  const [newGroup, setNewGroup] = useState("");
  const [newGroupTag, setNewGroupTag] = useState("");
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    groupId: groups[0]?.id ?? "",
    kills: 0,
    placement: 0,
  });
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editPlayerData, setEditPlayerData] = useState({ kills: 0, placement: 1 });

  // Bracket: score inputs per match
  const [scores, setScores] = useState<Record<string, { s1: number; s2: number }>>({});

  // Scoring config editor state
  const [scoringDraft, setScoringDraft] = useState<ScoringConfig>(
    () => tournament?.scoring ?? DEFAULT_SCORING
  );
  const [scoringSaved, setScoredSaved] = useState(false);

  const getScore = (matchId: string) =>
    scores[matchId] ?? {
      s1: matches.find((m) => m.id === matchId)?.score1 ?? 0,
      s2: matches.find((m) => m.id === matchId)?.score2 ?? 0,
    };

  if (!tournament || !infoForm) {
    return (
      <div className="text-center py-20 text-muted-foreground font-mono text-sm">
        Turnir topilmadi.{" "}
        <Link to="/admin/dashboard" className="text-primary hover:underline">
          ← Dashboard
        </Link>
      </div>
    );
  }

  const handleSaveInfo = () => {
    updateTournament(id!, infoForm);
  };

  const handleAddGroup = () => {
    if (!newGroup.trim()) return;
    if (!newGroupTag.trim() || newGroupTag.trim().length > 2) return;
    const g = addGroup(id!, newGroup.trim(), newGroupTag.trim());
    setNewGroup("");
    setNewGroupTag("");
    if (!newPlayer.groupId) setNewPlayer((p) => ({ ...p, groupId: g.id }));
  };

  const handleAddPlayer = () => {
    if (!newPlayer.name.trim() || !newPlayer.groupId) return;
    addPlayer({ ...newPlayer, tournamentId: id! });
    setNewPlayer((p) => ({ ...p, name: "", kills: 0, placement: 0 }));
  };

  const handleStartEdit = (pid: string) => {
    const p = players.find((x) => x.id === pid);
    if (!p) return;
    setEditingPlayer(pid);
    setEditPlayerData({ kills: p.kills, placement: p.placement });
  };

  const handleSaveEdit = (pid: string) => {
    updatePlayer(pid, editPlayerData);
    setEditingPlayer(null);
  };

  const tabs: Array<{ key: EditTab; label: string; icon: React.ReactNode }> = [
    { key: "info", label: "Ma'lumot", icon: <Settings size={14} /> },
    { key: "players", label: "Guruhlar & O'yinchilar", icon: <Users size={14} /> },
    ...(tournament?.mode === "classic" ? [{ key: "classic" as EditTab, label: "Map natijalari", icon: <Crosshair size={14} /> }] : []),
    ...(tournament?.mode === "tdm" ? [{ key: "bracket" as EditTab, label: "Bracket", icon: <Swords size={14} /> }] : []),
    { key: "scoring", label: "Scoring", icon: <Star size={14} /> },
  ];

  const handleSaveScoring = () => {
    updateScoring(id!, scoringDraft);
    setScoredSaved(true);
    setTimeout(() => setScoredSaved(false), 2000);
  };

  const setPlacementPt = (idx: number, val: number) => {
    setScoringDraft((d) => {
      const pts = [...d.placementPts];
      pts[idx] = val;
      return { ...d, placementPts: pts };
    });
  };

  const qfMatches = matches
    .filter((m) => m.round === 0)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-7">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft size={13} />
          Dashboard
        </Link>
        <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl tracking-wider uppercase text-foreground truncate">
          {tournament.name}
        </h1>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          Turnirni boshqarish
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl border border-border w-full mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-['Barlow_Condensed'] font-semibold tracking-wide transition-all flex-shrink-0 ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Info tab ── */}
      {tab === "info" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-['Barlow_Condensed'] font-bold text-base tracking-wider uppercase text-foreground mb-5">
            Turnir Ma&apos;lumotlari
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="sm:col-span-2">
              <Label text="Turnir nomi" />
              <input className={inputCls} value={infoForm.name} onChange={(e) => setInfoForm((f) => f && ({ ...f, name: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label text="Tavsif" />
              <textarea className={`${inputCls} resize-none`} rows={2} value={infoForm.description} onChange={(e) => setInfoForm((f) => f && ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label text="O'yin" />
              <input className={inputCls} value={infoForm.game} onChange={(e) => setInfoForm((f) => f && ({ ...f, game: e.target.value }))} />
            </div>
            <div>
              <Label text="Turnir rejimi" />
              <select className={inputCls} value={infoForm.mode} onChange={(e) => setInfoForm((f) => f && ({ ...f, mode: e.target.value as "tdm" | "classic" }))}>
                <option value="classic">Classic — xarita natijalari</option>
                <option value="tdm">TDM — bracket</option>
              </select>
            </div>
            {infoForm.mode === "tdm" && (
              <div>
                <Label text="TDM format" />
                <select className={inputCls} value={infoForm.tdmFormat} onChange={(e) => setInfoForm((f) => f && ({ ...f, tdmFormat: e.target.value as "1v1" | "2v2" | "3v3" | "4v4" }))}>
                  <option value="1v1">1 × 1</option><option value="2v2">2 × 2</option><option value="3v3">3 × 3</option><option value="4v4">4 × 4</option>
                </select>
              </div>
            )}
            <div>
              <Label text="Holat" />
              <select className={inputCls} value={infoForm.status} onChange={(e) => setInfoForm((f) => f && ({ ...f, status: e.target.value as TournamentStatus }))}>
                <option value="upcoming">Kutilmoqda</option>
                <option value="ongoing">Davom etmoqda</option>
                <option value="completed">Yakunlandi</option>
              </select>
            </div>
            <div>
              <Label text="Boshlanish" />
              <input className={inputCls} type="date" value={infoForm.startDate} onChange={(e) => setInfoForm((f) => f && ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <Label text="Tugash" />
              <input className={inputCls} type="date" value={infoForm.endDate} onChange={(e) => setInfoForm((f) => f && ({ ...f, endDate: e.target.value }))} />
            </div>
            <div>
              <Label text="Sovrin fondi" />
              <input className={inputCls} value={infoForm.prizePool} onChange={(e) => setInfoForm((f) => f && ({ ...f, prizePool: e.target.value }))} placeholder="10,000,000 so'm" />
            </div>
            <div>
              <Label text="Joylashuv" />
              <input className={inputCls} value={infoForm.location} onChange={(e) => setInfoForm((f) => f && ({ ...f, location: e.target.value }))} placeholder="Toshkent" />
            </div>
          </div>
          <button
            onClick={handleSaveInfo}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-['Barlow_Condensed'] font-bold tracking-wider text-sm hover:bg-primary/90 transition-all"
          >
            Saqlash
          </button>

          {/* Public link */}
          <div className="mt-6 pt-5 border-t border-border">
            <Label text="Ommaviy havola" />
            <Link
              to={`/tournament/${id}`}
              target="_blank"
              className="text-xs font-mono text-primary hover:underline"
            >
              /tournament/{id} →
            </Link>
          </div>
        </div>
      )}

      {/* ── Players tab ── */}
      {tab === "players" && (
        <div className="space-y-5">
          {/* Add group */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground mb-4 flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              Guruh Qo&apos;shish
            </h3>
            <div className="grid grid-cols-[1fr_86px_auto] gap-3">
              <input
                className={inputCls}
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="Kamanda nomi"
                onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
              />
              <input className={inputCls} value={newGroupTag} maxLength={2} onChange={(e) => setNewGroupTag(e.target.value.toUpperCase())} placeholder="TAG" aria-label="2 belgili kamanda qisqartmasi" />
              <button
                onClick={handleAddGroup}
                disabled={!newGroup.trim() || !newGroupTag.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-['Barlow_Condensed'] font-bold text-sm tracking-wide hover:bg-primary/90 transition-all disabled:opacity-40 flex-shrink-0"
              >
                <Plus size={14} />
                Qo&apos;sh
              </button>
            </div>

            {/* Groups list */}
            {groups.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {groups.map((g) => (
                  <span
                    key={g.id}
                    className="flex items-center gap-1.5 text-xs font-mono bg-secondary border border-border px-3 py-1.5 rounded-full text-foreground"
                  >
                    <Shield size={10} className="text-primary/60" />
                    <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">{g.tag}</span>
                    {g.name}
                    <button
                      onClick={() => deleteGroup(g.id)}
                      className="text-muted-foreground hover:text-destructive ml-1"
                    >
                      <Trash2 size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add player */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground mb-4 flex items-center gap-2">
              <Users size={14} className="text-primary" />
              O&apos;yinchi Qo&apos;shish
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">{players.length}/{tournament.maxPlayers} ta</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="col-span-2 sm:col-span-1">
                <Label text="Nickname" />
                <input
                  className={inputCls}
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nickname"
                />
              </div>
              <div>
                <Label text="Guruh" />
                <select
                  className={inputCls}
                  value={newPlayer.groupId}
                  onChange={(e) => setNewPlayer((p) => ({ ...p, groupId: e.target.value }))}
                >
                  <option value="">— Tanlang</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>[{g.tag}] {g.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddPlayer}
              disabled={!newPlayer.name.trim() || !newPlayer.groupId || players.length >= tournament.maxPlayers}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg font-['Barlow_Condensed'] font-bold text-sm tracking-wide hover:bg-primary/90 transition-all disabled:opacity-40"
            >
              <Plus size={14} />
              {players.length >= tournament.maxPlayers ? "Limit to&apos;lgan" : "Qo&apos;shish"}
            </button>
          </div>

          {/* Players grouped */}
          {groups.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center text-muted-foreground font-mono text-sm">
              Avval guruh qo&apos;shing
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map((g) => {
                const gPlayers = players
                  .filter((p) => p.groupId === g.id)
                  .sort((a, b) => getPoints(b.kills, b.placement, tournament?.scoring) - getPoints(a.kills, a.placement, tournament?.scoring));
                return (
                  <div key={g.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
                      <Shield size={13} className="text-primary" />
                      <span className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase">
                        <span className="text-primary">[{g.tag}]</span> {g.name}
                      </span>
                      <span className="ml-auto text-xs font-mono text-muted-foreground">
                        {gPlayers.length} ta
                      </span>
                    </div>
                    {gPlayers.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground font-mono">Bo&apos;sh</div>
                    ) : (
                      gPlayers.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors"
                        >
                          {editingPlayer === p.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-['Barlow_Condensed'] tracking-wide min-w-0 truncate flex-1">
                                {p.name}
                              </span>
                              <input
                                className="w-12 text-center text-xs bg-muted rounded border border-border font-mono py-1 focus:outline-none focus:border-primary/50"
                                type="number"
                                min={0}
                                value={editPlayerData.kills}
                                onChange={(e) => setEditPlayerData((d) => ({ ...d, kills: Number(e.target.value) }))}
                              />
                              <input
                                className="w-12 text-center text-xs bg-muted rounded border border-border font-mono py-1 focus:outline-none focus:border-primary/50"
                                type="number"
                                min={1}
                                value={editPlayerData.placement}
                                onChange={(e) => setEditPlayerData((d) => ({ ...d, placement: Number(e.target.value) }))}
                              />
                              <button
                                onClick={() => handleSaveEdit(p.id)}
                                className="text-xs px-2 py-1 bg-primary/20 text-primary rounded font-mono"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-sm font-['Barlow_Condensed'] tracking-wide truncate">{p.name}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-[10px] font-mono text-primary">[{g.tag}]</span>
                                {tournament.mode === "tdm" && <span className="text-xs font-mono text-muted-foreground">TDM</span>}
                                {tournament.mode === "tdm" && <button
                                  onClick={() => handleStartEdit(p.id)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Settings size={12} />
                                </button>}
                                <button
                                  onClick={() => deletePlayer(p.id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "classic" && tournament.mode === "classic" && (
        <ClassicResultsPanel tournamentId={id!} groups={groups} players={players} scoring={tournament.scoring} results={classicResults} onSave={saveClassicMapResult} onDelete={deleteClassicMapResult} />
      )}

      {/* ── Bracket tab ── */}
      {tab === "bracket" && (
        <div className="space-y-6">
          {/* QF participants */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground flex items-center gap-2">
                <Swords size={14} className="text-primary" />
                1-raund Ishtirokchilari
              </h3>
              <button
                onClick={() => resetTournamentBracket(id!)}
                className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 px-3 py-1.5 rounded transition-all"
              >
                <RotateCcw size={11} />
                Reset
              </button>
            </div>
            <div className="space-y-3">
              {qfMatches.map((m, i) => (
                <div key={m.id} className="grid grid-cols-[auto_1fr_auto_1fr] gap-3 items-center">
                  <span className="text-xs font-mono text-muted-foreground w-14 flex-shrink-0">
                    Match {i + 1}
                  </span>
                  <select
                    className={inputCls}
                    value={m.player1Id ?? ""}
                    onChange={(e) =>
                      updateMatchParticipants(m.id, e.target.value || null, m.player2Id)
                    }
                  >
                    <option value="">— O&apos;yinchi</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <span className="text-xs font-mono text-muted-foreground text-center px-1">VS</span>
                  <select
                    className={inputCls}
                    value={m.player2Id ?? ""}
                    onChange={(e) =>
                      updateMatchParticipants(m.id, m.player1Id, e.target.value || null)
                    }
                  >
                    <option value="">— O&apos;yinchi</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Live bracket preview with admin controls */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground mb-5 flex items-center gap-2">
              <LayoutGrid size={14} className="text-primary" />
              Bracket — G&apos;oliblarni Belgilash
            </h3>
            {matches.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground font-mono text-sm">
                Bracket ma&apos;lumotlari yo&apos;q
              </div>
            ) : (
              <BracketView
                matches={matches}
                players={players}
                isAdmin={true}
                scoring={tournament.scoring}
                onSetWinner={updateMatchResult}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Scoring tab ── */}
      {tab === "scoring" && (
        <div className="space-y-6 max-w-2xl">
          {/* Presets */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground mb-4 flex items-center gap-2">
              <Star size={14} className="text-primary" />
              Tayyor Shablonlar
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SCORING_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setScoringDraft({ ...preset.config })}
                  className="text-left rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 p-3 transition-all group"
                >
                  <div className="font-['Barlow_Condensed'] font-bold text-sm tracking-wide text-foreground group-hover:text-primary transition-colors">
                    {preset.label}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5 leading-snug">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Kill points */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground flex items-center gap-2">
                <Crosshair size={14} className="text-primary" />
                Kill Ballari
              </h3>
              <span className="text-xs font-mono text-muted-foreground">Har bir kill uchun</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <input
                className={`${inputCls} w-24 text-center text-lg font-bold`}
                type="number"
                min={0}
                max={10}
                value={scoringDraft.killPts}
                onChange={(e) => setScoringDraft((d) => ({ ...d, killPts: Number(e.target.value) }))}
              />
              <span className="text-sm text-muted-foreground font-mono">
                kill × {scoringDraft.killPts} = ball
              </span>
            </div>
          </div>

          {/* Placement points editor */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-['Barlow_Condensed'] font-bold text-sm tracking-wider uppercase text-foreground mb-5 flex items-center gap-2">
              <LayoutGrid size={14} className="text-primary" />
              O&apos;rin Ballari
            </h3>

            {/* Top 3 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-amber-400/20" />
                <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase">🏆 Top 3</span>
                <div className="h-px flex-1 bg-amber-400/20" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-center">
                    <div className="text-lg mb-1">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                    <div className="text-[10px] font-mono text-amber-400/70 mb-2">{i + 1}. o&apos;rin</div>
                    <input
                      className="w-full text-center bg-secondary border border-amber-400/20 rounded-lg px-2 py-1.5 text-base font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400/50 transition-colors"
                      type="number"
                      min={0}
                      value={scoringDraft.placementPts[i] ?? 0}
                      onChange={(e) => setPlacementPt(i, Number(e.target.value))}
                    />
                    <div className="text-[9px] font-mono text-muted-foreground mt-1">pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 4-10 */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-primary/15" />
                <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">🎯 Top 4–10</span>
                <div className="h-px flex-1 bg-primary/15" />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 p-2 text-center">
                    <div className="text-[9px] font-mono text-primary/60 mb-1.5">{i + 1}.</div>
                    <input
                      className="w-full text-center bg-secondary border border-border rounded px-1 py-1 text-sm font-mono font-semibold text-primary focus:outline-none focus:border-primary/40 transition-colors"
                      type="number"
                      min={0}
                      value={scoringDraft.placementPts[i] ?? 0}
                      onChange={(e) => setPlacementPt(i, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 11-20 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">📊 11–20</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => (
                  <div key={i} className="rounded border border-border bg-secondary/40 p-1.5 text-center">
                    <div className="text-[9px] font-mono text-muted-foreground mb-1">{i + 1}.</div>
                    <input
                      className="w-full text-center bg-secondary border border-border rounded px-0.5 py-0.5 text-xs font-mono text-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
                      type="number"
                      min={0}
                      value={scoringDraft.placementPts[i] ?? 0}
                      onChange={(e) => setPlacementPt(i, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formula preview */}
          <div className="rounded-xl border border-border bg-secondary/30 px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Formula: Kill × {scoringDraft.killPts} + O&apos;rin bali
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Misol: 5 kill, 1. o&apos;rin = {5 * scoringDraft.killPts + (scoringDraft.placementPts[0] ?? 0)} pts
            </span>
          </div>

          {/* Save */}
          <button
            onClick={handleSaveScoring}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-['Barlow_Condensed'] font-bold tracking-wider uppercase text-sm transition-all ${
              scoringSaved
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {scoringSaved ? <Check size={15} /> : <Star size={15} />}
            {scoringSaved ? "Saqlandi!" : "Saqlash"}
          </button>
        </div>
      )}
    </div>
  );
}
