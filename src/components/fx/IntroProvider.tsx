"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type IntroState = { ready: boolean; finish: () => void };

const IntroContext = createContext<IntroState>({ ready: true, finish: () => {} });

/** Longest the hero is ever allowed to wait on the preloader. */
const FAILSAFE_MS = 4500;

/**
 * Gates the hero entrance on the preloader finishing its wipe.
 *
 * The failsafe matters: everything below the fold is static, but the hero only
 * animates in once `ready` flips. If the preloader's exit callback were ever
 * missed the name would simply never appear, so time it out unconditionally.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => setReady(true), []);

  useEffect(() => {
    const id = window.setTimeout(finish, FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, [finish]);

  return (
    <IntroContext.Provider value={{ ready, finish }}>
      {children}
    </IntroContext.Provider>
  );
}

export const useIntro = () => useContext(IntroContext);
