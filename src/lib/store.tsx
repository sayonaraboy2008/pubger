import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  AppData,
  Tournament,
  Group,
  Player,
  BracketMatch,
  ScoringConfig,
  ClassicMapResult,
} from "./types";
import { uid, createMatchesForTournament, promoteWinner } from "./utils";

// Vercel uchun nisbiy manzil
const API_URL = import.meta.env.VITE_API_URL || "/api";

const initialData: AppData = {
  tournaments: [],
  groups: [],
  players: [],
  matches: [],
  classicResults: [],
};

interface StoreCtx {
  data: AppData;
  isLoading: boolean;
  addTournament: (
    t: Omit<Tournament, "id" | "createdAt">,
  ) => Promise<Tournament>;
  updateTournament: (
    id: string,
    updates: Partial<Omit<Tournament, "id" | "createdAt">>,
  ) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  addGroup: (tournamentId: string, name: string, tag: string) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;
  addPlayer: (p: Omit<Player, "id">) => Promise<Player | null>;
  updatePlayer: (
    id: string,
    updates: Partial<Omit<Player, "id">>,
  ) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  updateMatchResult: (
    matchId: string,
    winnerId: string,
    s1: number,
    s2: number,
  ) => Promise<void>;
  updateMatchParticipants: (
    matchId: string,
    p1: string | null,
    p2: string | null,
  ) => Promise<void>;
  resetTournamentBracket: (tournamentId: string) => Promise<void>;
  updateScoring: (
    tournamentId: string,
    scoring: ScoringConfig,
  ) => Promise<void>;
  saveClassicMapResult: (
    result: Omit<ClassicMapResult, "id"> & { id?: string },
  ) => Promise<void>;
  deleteClassicMapResult: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreCtx>(null!);

// Helper: serverdan kelgan obyektdan id ni olish
function normalizeId(obj: any): any {
  if (!obj) return obj;
  return { ...obj, id: obj.id || obj._id };
}

// Helper: xavfsiz fetch — xato bo'lsa console'ga chiqaradi
async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errText = await res.text();
    console.error(`API Error [${options?.method || "GET"} ${url}]:`, errText);
    throw new Error(errText || "API request failed");
  }
  return res.json();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Ilovani yuklashda va har 5 soniyada ma'lumotlarni yangilab turish (real-time o'xshash)
  useEffect(() => {
    const loadData = () => {
      fetch(`${API_URL}/data`)
        .then((res) => res.json())
        .then((serverData) => {
          setData({
            tournaments: (serverData.tournaments || []).map(normalizeId),
            groups: (serverData.groups || []).map(normalizeId),
            players: (serverData.players || []).map(normalizeId),
            matches: (serverData.matches || []).map(normalizeId),
            classicResults: (serverData.classicResults || []).map(normalizeId),
          });
        })
        .catch((err) => console.error("Failed to load data:", err))
        .finally(() => setIsLoading(false));
    };

    loadData();
    const intervalId = setInterval(loadData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const mutate = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => fn(prev));
  }, []);

  // ─── Tournaments ─────────────────────────────────────────────────────────────
  const addTournament = useCallback(
    async (t: Omit<Tournament, "id" | "createdAt">): Promise<Tournament> => {
      const id = uid("t");
      const createdAt = new Date().toISOString();
      const tournament = { ...t, id, createdAt };

      // Turnirni serverga saqlash
      const saved = normalizeId(
        await apiFetch(`${API_URL}/tournaments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tournament),
        }),
      );

      // Boshlang'ich matchlarni yaratish (TDM uchun bracket)
      const newMatches = createMatchesForTournament(saved.id);
      if (newMatches.length > 0) {
        await apiFetch(`${API_URL}/matches/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMatches),
        });
      }

      mutate((d) => ({
        ...d,
        tournaments: [...d.tournaments, saved],
        matches: [...d.matches, ...newMatches],
      }));
      return saved;
    },
    [mutate],
  );

  const updateTournament = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Tournament, "id" | "createdAt">>,
    ) => {
      await apiFetch(`${API_URL}/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      mutate((d) => ({
        ...d,
        tournaments: d.tournaments.map((t) =>
          t.id === id ? { ...t, ...updates } : t,
        ),
      }));
    },
    [mutate],
  );

  const deleteTournament = useCallback(
    async (id: string) => {
      await apiFetch(`${API_URL}/tournaments/${id}`, { method: "DELETE" });
      mutate((d) => ({
        tournaments: d.tournaments.filter((t) => t.id !== id),
        groups: d.groups.filter((g) => g.tournamentId !== id),
        players: d.players.filter((p) => p.tournamentId !== id),
        matches: d.matches.filter((m) => m.tournamentId !== id),
        classicResults: d.classicResults.filter((r) => r.tournamentId !== id),
      }));
    },
    [mutate],
  );

  // ─── Groups ──────────────────────────────────────────────────────────────────
  const addGroup = useCallback(
    async (tournamentId: string, name: string, tag: string): Promise<Group> => {
      const group = {
        id: uid("g"),
        tournamentId,
        name,
        tag: tag.toUpperCase().slice(0, 2),
      };
      const saved = normalizeId(
        await apiFetch(`${API_URL}/groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(group),
        }),
      );
      mutate((d) => ({ ...d, groups: [...d.groups, saved] }));
      return saved;
    },
    [mutate],
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      await apiFetch(`${API_URL}/groups/${id}`, { method: "DELETE" });
      mutate((d) => ({
        ...d,
        groups: d.groups.filter((g) => g.id !== id),
        players: d.players.filter((p) => p.groupId !== id),
      }));
    },
    [mutate],
  );

  // ─── Players ─────────────────────────────────────────────────────────────────
  const addPlayer = useCallback(
    async (p: Omit<Player, "id">): Promise<Player | null> => {
      let isFull = false;
      setData((d) => {
        const tournament = d.tournaments.find((t) => t.id === p.tournamentId);
        const currentCount = d.players.filter(
          (item) => item.tournamentId === p.tournamentId,
        ).length;
        if (currentCount >= (tournament?.maxPlayers ?? 32)) {
          isFull = true;
        }
        return d;
      });
      if (isFull) return null;

      const player = { ...p, id: uid("p") };
      const saved = normalizeId(
        await apiFetch(`${API_URL}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(player),
        }),
      );
      mutate((d) => ({ ...d, players: [...d.players, saved] }));
      return saved;
    },
    [mutate],
  );

  const updatePlayer = useCallback(
    async (id: string, updates: Partial<Omit<Player, "id">>) => {
      await apiFetch(`${API_URL}/players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      mutate((d) => ({
        ...d,
        players: d.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [mutate],
  );

  const deletePlayer = useCallback(
    async (id: string) => {
      await apiFetch(`${API_URL}/players/${id}`, { method: "DELETE" });
      mutate((d) => ({ ...d, players: d.players.filter((p) => p.id !== id) }));
    },
    [mutate],
  );

  // ─── Matches ─────────────────────────────────────────────────────────────────
  const updateMatchResult = useCallback(
    async (matchId: string, winnerId: string, s1: number, s2: number) => {
      let updatedMatches: BracketMatch[] = [];
      mutate((d) => {
        updatedMatches = promoteWinner(d.matches, matchId, winnerId, s1, s2);
        return { ...d, matches: updatedMatches };
      });

      await apiFetch(`${API_URL}/matches/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMatches),
      });
    },
    [mutate],
  );

  const updateMatchParticipants = useCallback(
    async (matchId: string, p1: string | null, p2: string | null) => {
      const updates = {
        player1Id: p1,
        player2Id: p2,
        score1: 0,
        score2: 0,
        winnerId: null,
      };
      await apiFetch(`${API_URL}/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      mutate((d) => ({
        ...d,
        matches: d.matches.map((m) =>
          m.id === matchId ? { ...m, ...updates } : m,
        ),
      }));
    },
    [mutate],
  );

  const resetTournamentBracket = useCallback(
    async (tournamentId: string) => {
      let updatedMatches: BracketMatch[] = [];
      mutate((d) => {
        updatedMatches = d.matches.map((m) =>
          m.tournamentId === tournamentId
            ? m.round === 0
              ? { ...m, score1: 0, score2: 0, winnerId: null }
              : {
                  ...m,
                  player1Id: null,
                  player2Id: null,
                  score1: 0,
                  score2: 0,
                  winnerId: null,
                }
            : m,
        );
        return { ...d, matches: updatedMatches };
      });

      const changes = updatedMatches.filter(
        (m) => m.tournamentId === tournamentId,
      );
      await apiFetch(`${API_URL}/matches/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    },
    [mutate],
  );

  // ─── Scoring ─────────────────────────────────────────────────────────────────
  const updateScoring = useCallback(
    async (tournamentId: string, scoring: ScoringConfig) => {
      await apiFetch(`${API_URL}/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoring }),
      });
      mutate((d) => ({
        ...d,
        tournaments: d.tournaments.map((t) =>
          t.id === tournamentId ? { ...t, scoring } : t,
        ),
      }));
    },
    [mutate],
  );

  // ─── Classic Results ──────────────────────────────────────────────────────────
  const saveClassicMapResult = useCallback(
    async (result: Omit<ClassicMapResult, "id"> & { id?: string }) => {
      const payload = { ...result, id: result.id || uid("map") };

      // Determine if it's a new result by checking the current state
      let isNew = false;
      setData((d) => {
        isNew = !d.classicResults.some((r) => r.id === payload.id);
        return d;
      });

      const method = isNew ? "POST" : "PUT";
      const url = isNew
        ? `${API_URL}/classicResults`
        : `${API_URL}/classicResults/${payload.id}`;

      const saved = normalizeId(
        await apiFetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      mutate((d) => ({
        ...d,
        classicResults: d.classicResults.some((r) => r.id === saved.id)
          ? d.classicResults.map((r) => (r.id === saved.id ? saved : r))
          : [...d.classicResults, saved],
      }));
    },
    [mutate],
  );

  const deleteClassicMapResult = useCallback(
    async (id: string) => {
      await apiFetch(`${API_URL}/classicResults/${id}`, { method: "DELETE" });
      mutate((d) => ({
        ...d,
        classicResults: d.classicResults.filter((r) => r.id !== id),
      }));
    },
    [mutate],
  );

  return (
    <StoreContext.Provider
      value={{
        data,
        isLoading,
        addTournament,
        updateTournament,
        deleteTournament,
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
