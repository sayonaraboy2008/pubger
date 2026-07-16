import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AppData, Tournament, Group, Player, BracketMatch, ScoringConfig, ClassicMapResult } from "./types";
import { uid, createMatchesForTournament, promoteWinner, DEFAULT_SCORING } from "./utils";

const API_URL = "http://localhost:5000/api";

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
  addTournament: (t: Omit<Tournament, "id" | "createdAt">) => Promise<Tournament>;
  updateTournament: (id: string, updates: Partial<Omit<Tournament, "id" | "createdAt">>) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  addGroup: (tournamentId: string, name: string, tag: string) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;
  addPlayer: (p: Omit<Player, "id">) => Promise<Player | null>;
  updatePlayer: (id: string, updates: Partial<Omit<Player, "id">>) => Promise<void>;
  deletePlayer: (id: string) => Promise<void>;
  updateMatchResult: (matchId: string, winnerId: string, s1: number, s2: number) => Promise<void>;
  updateMatchParticipants: (matchId: string, p1: string | null, p2: string | null) => Promise<void>;
  resetTournamentBracket: (tournamentId: string) => Promise<void>;
  updateScoring: (tournamentId: string, scoring: ScoringConfig) => Promise<void>;
  saveClassicMapResult: (result: Omit<ClassicMapResult, "id"> & { id?: string }) => Promise<void>;
  deleteClassicMapResult: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreCtx>(null!);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetch(`${API_URL}/data`)
      .then((res) => res.json())
      .then((serverData) => {
        setData({
          tournaments: serverData.tournaments || [],
          groups: serverData.groups || [],
          players: serverData.players || [],
          matches: serverData.matches || [],
          classicResults: serverData.classicResults || [],
        });
      })
      .catch((err) => console.error("Failed to load data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const mutate = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => fn(prev));
  }, []);

  const addTournament = useCallback(
    async (t: Omit<Tournament, "id" | "createdAt">): Promise<Tournament> => {
      const id = uid("t");
      const tournament = { ...t, id };
      const newMatches = createMatchesForTournament(id);
      
      // Save tournament
      const res = await fetch(`${API_URL}/tournaments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tournament),
      });
      const savedTournament = await res.json();
      savedTournament.id = savedTournament._id || savedTournament.id;

      // Save initial matches
      await fetch(`${API_URL}/matches/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatches),
      });

      mutate((d) => ({
        ...d,
        tournaments: [...d.tournaments, savedTournament],
        matches: [...d.matches, ...newMatches],
      }));
      return savedTournament;
    },
    [mutate]
  );

  const updateTournament = useCallback(
    async (id: string, updates: Partial<Omit<Tournament, "id" | "createdAt">>) => {
      await fetch(`${API_URL}/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      mutate((d) => ({
        ...d,
        tournaments: d.tournaments.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    [mutate]
  );

  const deleteTournament = useCallback(
    async (id: string) => {
      await fetch(`${API_URL}/tournaments/${id}`, { method: "DELETE" });

      mutate((d) => ({
        tournaments: d.tournaments.filter((t) => t.id !== id),
        groups: d.groups.filter((g) => g.tournamentId !== id),
        players: d.players.filter((p) => p.tournamentId !== id),
        matches: d.matches.filter((m) => m.tournamentId !== id),
        classicResults: d.classicResults.filter((r) => r.tournamentId !== id),
      }));
    },
    [mutate]
  );

  const addGroup = useCallback(
    async (tournamentId: string, name: string, tag: string): Promise<Group> => {
      const group = { id: uid("g"), tournamentId, name, tag: tag.toUpperCase().slice(0, 2) };
      
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
      });
      const saved = await res.json();
      saved.id = saved._id || saved.id;

      mutate((d) => ({ ...d, groups: [...d.groups, saved] }));
      return saved;
    },
    [mutate]
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      await fetch(`${API_URL}/groups/${id}`, { method: "DELETE" });

      mutate((d) => ({
        ...d,
        groups: d.groups.filter((g) => g.id !== id),
        players: d.players.filter((p) => p.groupId !== id),
      }));
    },
    [mutate]
  );

  const addPlayer = useCallback(
    async (p: Omit<Player, "id">): Promise<Player | null> => {
      let isFull = false;
      setData((d) => {
        const tournament = d.tournaments.find((t) => t.id === p.tournamentId);
        const currentCount = d.players.filter((item) => item.tournamentId === p.tournamentId).length;
        if (currentCount >= (tournament?.maxPlayers ?? 32)) {
          isFull = true;
        }
        return d;
      });

      if (isFull) return null;

      const player = { ...p, id: uid("p") };
      const res = await fetch(`${API_URL}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
      });
      const saved = await res.json();
      saved.id = saved._id || saved.id;

      mutate((d) => ({ ...d, players: [...d.players, saved] }));
      return saved;
    },
    [mutate]
  );

  const updatePlayer = useCallback(
    async (id: string, updates: Partial<Omit<Player, "id">>) => {
      await fetch(`${API_URL}/players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      mutate((d) => ({
        ...d,
        players: d.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [mutate]
  );

  const deletePlayer = useCallback(
    async (id: string) => {
      await fetch(`${API_URL}/players/${id}`, { method: "DELETE" });

      mutate((d) => ({ ...d, players: d.players.filter((p) => p.id !== id) }));
    },
    [mutate]
  );

  const updateMatchResult = useCallback(
    async (matchId: string, winnerId: string, s1: number, s2: number) => {
      let updatedMatches: BracketMatch[] = [];
      mutate((d) => {
        updatedMatches = promoteWinner(d.matches, matchId, winnerId, s1, s2);
        return { ...d, matches: updatedMatches };
      });

      // Sync the whole matches collection (or just the ones that changed)
      // For simplicity here, we can bulk update changed matches.
      const changes = updatedMatches.filter(m => m.id === matchId || m.round > 0); // basic diff tracking
      await fetch(`${API_URL}/matches/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    },
    [mutate]
  );

  const updateMatchParticipants = useCallback(
    async (matchId: string, p1: string | null, p2: string | null) => {
      const updates = { player1Id: p1, player2Id: p2, score1: 0, score2: 0, winnerId: null };
      
      await fetch(`${API_URL}/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      mutate((d) => ({
        ...d,
        matches: d.matches.map((m) =>
          m.id === matchId ? { ...m, ...updates } : m
        ),
      }));
    },
    [mutate]
  );

  const updateScoring = useCallback(
    async (tournamentId: string, scoring: ScoringConfig) => {
      await fetch(`${API_URL}/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoring }),
      });

      mutate((d) => ({
        ...d,
        tournaments: d.tournaments.map((t) =>
          t.id === tournamentId ? { ...t, scoring } : t
        ),
      }));
    },
    [mutate]
  );

  const saveClassicMapResult = useCallback(async (result: Omit<ClassicMapResult, "id"> & { id?: string }) => {
    const isNew = !result.id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `${API_URL}/classicResults` : `${API_URL}/classicResults/${result.id}`;
    
    const payload = { ...result, id: result.id || uid("map") };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const saved = await res.json();
    saved.id = saved._id || saved.id;

    mutate((d) => ({
      ...d,
      classicResults: d.classicResults.some((r) => r.id === saved.id)
        ? d.classicResults.map((r) => (r.id === saved.id ? saved : r))
        : [...d.classicResults, saved],
    }));
  }, [mutate]);

  const deleteClassicMapResult = useCallback(async (id: string) => {
    await fetch(`${API_URL}/classicResults/${id}`, { method: "DELETE" });

    mutate((d) => ({ ...d, classicResults: d.classicResults.filter((r) => r.id !== id) }));
  }, [mutate]);

  const resetTournamentBracket = useCallback(
    async (tournamentId: string) => {
      let updatedMatches: BracketMatch[] = [];
      mutate((d) => {
        updatedMatches = d.matches.map((m) =>
          m.tournamentId === tournamentId
            ? m.round === 0
              ? { ...m, score1: 0, score2: 0, winnerId: null }
              : { ...m, player1Id: null, player2Id: null, score1: 0, score2: 0, winnerId: null }
            : m
        );
        return { ...d, matches: updatedMatches };
      });

      const changes = updatedMatches.filter(m => m.tournamentId === tournamentId);
      await fetch(`${API_URL}/matches/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    },
    [mutate]
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
