import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// --- 1. Basic store: state + actions in one create() call ---
export type CounterStore = {
  count: number;
  lastAction: string;
  label: string;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  lastAction: "none",
  label: "Zustand counter (never changes)",
  increment: () =>
    set((state) => ({
      count: state.count + 1,
      lastAction: "increment",
    })),
  decrement: () =>
    set((state) => ({
      count: state.count - 1,
      lastAction: "decrement",
    })),
  reset: () => set({ count: 0, lastAction: "reset" }),
}));

// --- 2. Persist middleware: survives page refresh (sessionStorage) ---
export type PreferencesStore = {
  accent: "blue" | "green" | "purple";
  setAccent: (accent: "blue" | "green" | "purple") => void;
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      accent: "blue",
      setAccent: (accent) => set({ accent }),
    }),
    {
      name: "zustand-demo-preferences",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

// --- 3. Todo list store: array updates + getState/subscribe from outside React ---
export type Todo = { id: number; text: string; done: boolean };

export type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  clearDone: () => void;
};

let nextTodoId = 1;

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  addTodo: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    set({
      todos: [...get().todos, { id: nextTodoId++, text: trimmed, done: false }],
    });
  },
  toggleTodo: (id) =>
    set({
      todos: get().todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    }),
  clearDone: () =>
    set({
      todos: get().todos.filter((todo) => !todo.done),
    }),
}));
