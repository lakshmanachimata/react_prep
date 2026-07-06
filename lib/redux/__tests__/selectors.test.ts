import { selectCounterSummary, selectDoubleCount } from "@/lib/redux/selectors";
import { createDemoStore } from "@/lib/redux/store";
import { increment } from "@/lib/redux/counterSlice";
import { toggleTheme } from "@/lib/redux/uiSlice";

describe("redux selectors", () => {
  it("selectDoubleCount doubles counter", () => {
    const store = createDemoStore();
    store.dispatch(increment());
    store.dispatch(increment());

    expect(selectDoubleCount(store.getState())).toBe(4);
  });

  it("selectCounterSummary combines counter and ui", () => {
    const store = createDemoStore();
    store.dispatch(increment());
    store.dispatch(toggleTheme());

    expect(selectCounterSummary(store.getState())).toBe("count=1, theme=dark");
  });

  it("selectDoubleCount memoizes when count unchanged", () => {
    const store = createDemoStore();
    const state = store.getState();
    const first = selectDoubleCount(state);
    const second = selectDoubleCount(state);
    expect(first).toBe(second);
  });
});
