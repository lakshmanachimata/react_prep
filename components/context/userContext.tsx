"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultUser, type UserData } from "@/components/context/userTypes";

// Everything descendants can read or update — data + setters in one bag.
type UserContextValue = UserData & {
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
};

// `null` default lets useUser() detect missing <UserContext> wrapper (see guard below).
const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  children,
  initialUser = defaultUser,
}: {
  children: ReactNode;
  // Lets a nested <UserProvider> supply a different starting user (context override).
  initialUser?: UserData;
}) {
  const [name, setName] = useState(initialUser.name);
  const [age, setAge] = useState(initialUser.age);
  const [gender, setGender] = useState(initialUser.gender);

  // Bundle state + setters into one `value` passed to <UserContext value={...}>.
  // New object whenever name/age/gender change — all useUser() consumers re-render.
  // (Split context in splitUserContext.tsx avoids this for dispatch-only readers.)
  const value = useMemo(
    () => ({
      name,
      age,
      gender,
      setName,
      setAge,
      setGender,
    }),
    [name, age, gender],
  );

  // React 19: render <UserContext value={...}> directly (no .Provider).
  return <UserContext value={value}>{children}</UserContext>;
}

// Thin wrapper around useContext — keeps imports clean and gives a clear hook name.
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
