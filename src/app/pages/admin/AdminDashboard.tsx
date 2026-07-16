import { useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Trash2,
  Pencil,
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import { useStore } from "../../../lib/store";
import type { TournamentStatus } from "../../../lib/types";
import { statusLabel, statusColor, DEFAULT_SCORING } from "../../../lib/utils";

const EMPTY_FORM = {
  name: "",
  description: "",
  game: "PUBG Mobile",
  status: "upcoming" as TournamentStatus,
  startDate: "",
  endDate: "",
  prizePool: "",
  location: "",
  scoring: DEFAULT_SCORING,
  mode: "classic" as const,
  tdmFormat: "4v4" as const,
  maxPlayers: 32,
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "bg-secondary/80 border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40 w-full";

export default function AdminDashboard() {
  const { data, addTournament, deleteTournament } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const setField = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addTournament(form);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTournament(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const sorted = [...data.tournaments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-['Barlow_Condensed'] font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-0.5">
            {data.tournaments.length} ta turnir
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-['Barlow_Condensed'] font-bold tracking-wider uppercase text-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Bekor qilish" : "Yangi Turnir"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-primary/20 bg-card p-6 mb-6">
          <h2 className="font-['Barlow_Condensed'] font-bold text-lg tracking-wider uppercase text-foreground mb-5">
            Yangi Turnir Qo&apos;shish
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="sm:col-span-2">
              <Field label="Turnir nomi *">
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="PUBG Mobile Summer Cup 2025"
                />
              </Field>
            </div>
            <Field label="Turnir rejimi">
              <select className={inputCls} value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as "tdm" | "classic" }))}>
                <option value="classic">Classic — xarita natijalari va leaderboard</option>
                <option value="tdm">TDM — bracket / duel</option>
              </select>
            </Field>
            {form.mode === "tdm" && (
              <Field label="TDM format">
                <select className={inputCls} value={form.tdmFormat} onChange={(e) => setForm((f) => ({ ...f, tdmFormat: e.target.value as "1v1" | "2v2" | "3v3" | "4v4" }))}>
                  <option value="1v1">1 × 1</option><option value="2v2">2 × 2</option><option value="3v3">3 × 3</option><option value="4v4">4 × 4</option>
                </select>
              </Field>
            )}
            <div className="sm:col-span-2">
              <Field label="Tavsif">
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={2}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Turnir haqida qisqacha..."
                />
              </Field>
            </div>
            <Field label="O'yin">
              <input
                className={inputCls}
                value={form.game}
                onChange={(e) => setField("game", e.target.value)}
              />
            </Field>
            <Field label="Holat">
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="upcoming">Kutilmoqda</option>
                <option value="ongoing">Davom etmoqda</option>
                <option value="completed">Yakunlandi</option>
              </select>
            </Field>
            <Field label="Boshlanish sanasi">
              <input
                className={inputCls}
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </Field>
            <Field label="Tugash sanasi">
              <input
                className={inputCls}
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
              />
            </Field>
            <Field label="Sovrin fondi">
              <input
                className={inputCls}
                value={form.prizePool}
                onChange={(e) => setField("prizePool", e.target.value)}
                placeholder="10,000,000 so'm"
              />
            </Field>
            <Field label="Joylashuv">
              <input
                className={inputCls}
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="Toshkent"
              />
            </Field>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!form.name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-['Barlow_Condensed'] font-bold tracking-wider text-sm hover:bg-primary/90 transition-all disabled:opacity-40"
            >
              <Plus size={15} />
              Qo&apos;shish
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="px-5 py-2.5 border border-border rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              Bekor
            </button>
          </div>
        </div>
      )}

      {/* Tournament list */}
      {sorted.length === 0 ? (
        <div className="py-20 text-center rounded-xl border border-border bg-card">
          <Trophy size={32} className="text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-mono text-sm">
            Hali turnirlar yo&apos;q. Yangi turnir qo&apos;shing.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-secondary border-b border-border">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Turnir</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Holat</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">O&apos;yinchilar</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Sana</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Amal</span>
          </div>

          {sorted.map((t) => {
            const playerCount = data.players.filter((p) => p.tournamentId === t.id).length;
            const isDeleting = deleteConfirm === t.id;

            return (
              <div
                key={t.id}
                className={`flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:gap-4 px-5 py-4 border-b border-border/50 last:border-0 items-start sm:items-center hover:bg-secondary/20 transition-colors ${
                  isDeleting ? "bg-destructive/5" : ""
                }`}
              >
                {/* Name */}
                <div className="min-w-0 mb-2 sm:mb-0">
                  <div className="font-['Barlow_Condensed'] font-bold text-base tracking-wide text-foreground truncate">
                    {t.name}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">{t.game} · {t.mode === "classic" ? "Classic" : "TDM"} · {t.location}</div>
                </div>

                {/* Status */}
                <span
                  className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded border ${statusColor[t.status]}`}
                >
                  {statusLabel[t.status]}
                </span>

                {/* Players */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Users size={11} />
                  <span>{playerCount}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Calendar size={11} />
                  <span>{t.startDate}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Link
                    to={`/admin/tournament/${t.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border hover:border-primary/30 rounded text-xs font-mono transition-all"
                  >
                    <Pencil size={11} />
                    <span className="hidden sm:inline">Tahrirlash</span>
                    <ChevronRight size={11} />
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all border ${
                      isDeleting
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-secondary border-border text-muted-foreground hover:text-destructive hover:border-destructive/30"
                    }`}
                  >
                    <Trash2 size={11} />
                    <span className="hidden sm:inline">{isDeleting ? "Tasdiqlang!" : "O'chirish"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
