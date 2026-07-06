import counterReducer, {
  decrement,
  fetchBonus,
  increment,
  reset,
} from "@/lib/redux/counterSlice";
import { createDemoStore } from "@/lib/redux/store";

describe("counterSlice reducer", () => {
  const initial = counterReducer(undefined, { type: "@@INIT" });

  it("has expected initial state", () => {
    expect(initial).toEqual({
      count: 0,
      lastAction: "none",
      label: "Global Redux store",
      status: "idle",
    });
  });

  it("increment increases count", () => {
    const next = counterReducer(initial, increment());
    expect(next.count).toBe(1);
    expect(next.lastAction).toBe("increment");
  });

  it("decrement decreases count", () => {
    const state = counterReducer(initial, increment());
    const next = counterReducer(state, decrement());
    expect(next.count).toBe(0);
    expect(next.lastAction).toBe("decrement");
  });

  it("reset clears count and status", () => {
    const state = counterReducer(
      { ...initial, count: 5, status: "loading", lastAction: "x" },
      reset(),
    );
    expect(state.count).toBe(0);
    expect(state.status).toBe("idle");
    expect(state.lastAction).toBe("reset");
  });

  it("fetchBonus.fulfilled adds payload to count", () => {
    const loading = counterReducer(initial, fetchBonus.pending("req-1", undefined));
    const next = counterReducer(
      loading,
      fetchBonus.fulfilled(5, "req-1", undefined),
    );
    expect(next.count).toBe(5);
    expect(next.status).toBe("idle");
    expect(next.lastAction).toBe("fetchBonus:fulfilled");
  });

  it("fetchBonus.rejected resets status to idle", () => {
    const loading = counterReducer(initial, fetchBonus.pending("req-2", undefined));
    const next = counterReducer(
      loading,
      fetchBonus.rejected(new Error("bonus failed"), "req-2", undefined),
    );
    expect(next.status).toBe("idle");
    expect(next.lastAction).toBe("fetchBonus:rejected");
  });
});

describe("fetchBonus async thunk", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("adds bonus on fulfilled", async () => {
    const store = createDemoStore();
    const promise = store.dispatch(fetchBonus());
    await jest.runAllTimersAsync();
    await promise;

    expect(store.getState().counter.count).toBe(5);
    expect(store.getState().counter.lastAction).toBe("fetchBonus:fulfilled");
    expect(store.getState().counter.status).toBe("idle");
  });

  it("sets loading while pending", () => {
    const store = createDemoStore();
    store.dispatch(fetchBonus());
    expect(store.getState().counter.status).toBe("loading");
    expect(store.getState().counter.lastAction).toBe("fetchBonus:pending");
  });
});
