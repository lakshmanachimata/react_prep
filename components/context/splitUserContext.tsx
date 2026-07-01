"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultUser, type UserData } from "@/components/context/userTypes";

// Setter functions only — no user data. Kept separate from state on purpose.
type UserDispatch = {
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
};

// Two contexts instead of one big object (contrast with userContext.tsx).
// A component only re-renders when the context it actually reads changes.
const UserStateContext = createContext<UserData | null>(null);
const UserDispatchContext = createContext<UserDispatch | null>(null);

export function SplitUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);

  // Dispatch object is created once (empty deps) — same reference every render.
  // Functional updaters `setUser((current) => ...)` read latest state without
  // closing over a stale `user` value inside these setters.
  const dispatch = useMemo<UserDispatch>(
    () => ({
      setName: (name) => setUser((current) => ({ ...current, name })),
      setAge: (age) => setUser((current) => ({ ...current, age })),
      setGender: (gender) => setUser((current) => ({ ...current, gender })),
    }),
    [],
  );

  // React 19: nest <Context value={...}> — dispatch outside, state inside.
  // Order does not change behavior; both are available to all descendants.
  return (
    <UserDispatchContext value={dispatch}>
      <UserStateContext value={user}>{children}</UserStateContext>
    </UserDispatchContext>
  );
}

// Read-only hook for display components — re-renders when `user` changes.
export function useUserState() {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error("useUserState must be used within SplitUserProvider");
  }
  return context;
}

// Write-only hook for buttons/forms that only call setters — skips re-renders
// when `user` changes, as long as this component does not also call useUserState().
export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) {
    throw new Error("useUserDispatch must be used within SplitUserProvider");
  }
  return context;
}
