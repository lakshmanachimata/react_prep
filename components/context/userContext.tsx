"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultUser, type UserData } from "@/components/context/userTypes";

type UserContextValue = UserData & {
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState(defaultUser.name);
  const [age, setAge] = useState(defaultUser.age);
  const [gender, setGender] = useState(defaultUser.gender);

  // New object each time any field changes — all context consumers re-render.
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

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
