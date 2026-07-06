import {
  useCounterStore,
  usePreferencesStore,
  useTodoStore,
} from "@/lib/zustand/demoStores";

describe("useCounterStore", () => {
  beforeEach(() => {
    useCounterStore.getState().reset();
  });

  it("increments and decrements", () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(2);

    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(1);
    expect(useCounterStore.getState().lastAction).toBe("decrement");
  });

  it("reset restores initial count", () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
    expect(useCounterStore.getState().lastAction).toBe("reset");
  });
});

describe("usePreferencesStore", () => {
  beforeEach(() => {
    sessionStorage.clear();
    usePreferencesStore.setState({ accent: "blue" });
  });

  it("setAccent updates accent", () => {
    usePreferencesStore.getState().setAccent("purple");
    expect(usePreferencesStore.getState().accent).toBe("purple");
  });
});

describe("useTodoStore", () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [] });
  });

  it("addTodo adds trimmed todo", () => {
    useTodoStore.getState().addTodo("  Buy milk  ");
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe("Buy milk");
    expect(useTodoStore.getState().todos[0].done).toBe(false);
  });

  it("addTodo ignores empty string", () => {
    useTodoStore.getState().addTodo("   ");
    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it("toggleTodo marks todo done", () => {
    useTodoStore.getState().addTodo("Task");
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(id);
    expect(useTodoStore.getState().todos[0].done).toBe(true);
  });

  it("clearDone removes completed todos", () => {
    useTodoStore.getState().addTodo("A");
    useTodoStore.getState().addTodo("B");
    const id = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().toggleTodo(id);
    useTodoStore.getState().clearDone();
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].text).toBe("B");
  });
});
