import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getPersona, type Persona } from "./personas";

type Scores = {
  upi: number;
  fd: number;
  statement: number;
  bills: number;
  pin: number;
};

type State = {
  personaId: Persona["id"] | null;
  scores: Scores;
  achievements: string[];
  demoMode: boolean;
  seniorMode: boolean;
};

const KEY = "avanya:state:v1";
const DEFAULT: State = {
  personaId: null,
  scores: { upi: 35, fd: 10, statement: 20, bills: 45, pin: 30 },
  achievements: [],
  demoMode: false,
  seniorMode: false,
};

type Ctx = State & {
  persona: Persona | null;
  login: (id: Persona["id"]) => void;
  logout: () => void;
  bumpScore: (k: keyof Scores, by?: number) => void;
  unlock: (id: string) => void;
  setDemoMode: (v: boolean) => void;
  setSeniorMode: (v: boolean) => void;
  overallScore: number;
};

const StoreCtx = createContext<Ctx | null>(null);

function load(): State {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const login = useCallback((id: Persona["id"]) => {
    setState((s) => ({ ...s, personaId: id }));
  }, []);
  const logout = useCallback(() => {
    setState({ ...DEFAULT });
  }, []);
  const bumpScore = useCallback((k: keyof Scores, by = 15) => {
    setState((s) => ({ ...s, scores: { ...s.scores, [k]: Math.min(100, s.scores[k] + by) } }));
  }, []);
  const unlock = useCallback((id: string) => {
    setState((s) => (s.achievements.includes(id) ? s : { ...s, achievements: [...s.achievements, id] }));
  }, []);
  const setDemoMode = useCallback((v: boolean) => setState((s) => ({ ...s, demoMode: v })), []);
  const setSeniorMode = useCallback((v: boolean) => setState((s) => ({ ...s, seniorMode: v })), []);

  const persona = getPersona(state.personaId);
  const overallScore = useMemo(() => {
    const vals = Object.values(state.scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [state.scores]);

  const value: Ctx = {
    ...state,
    persona,
    login,
    logout,
    bumpScore,
    unlock,
    setDemoMode,
    setSeniorMode,
    overallScore,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}