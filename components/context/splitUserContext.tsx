"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultUser, type UserData } from "@/components/context/userTypes";

type UserDispatch = {
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
};

const UserStateContext = createContext<UserData | null>(null);
const UserDispatchContext = createContext<UserDispatch | null>(null);

export function SplitUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);

  // Stable dispatch object — consumers of dispatch alone skip re-renders on data edits.
  const dispatch = useMemo<UserDispatch>(
    () => ({
      setName: (name) => setUser((current) => ({ ...current, name })),
      setAge: (age) => setUser((current) => ({ ...current, age })),
      setGender: (gender) => setUser((current) => ({ ...current, gender })),
    }),
    [],
  );

  return (
    <UserDispatchContext.Provider value={dispatch}>
      <UserStateContext.Provider value={user}>{children}</UserStateContext.Provider>
    </UserDispatchContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error("useUserState must be used within SplitUserProvider");
  }
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) {
    throw new Error("useUserDispatch must be used within SplitUserProvider");
  }
  return context;
}
