import { createDemoStore } from "@/lib/redux/store";
import { increment } from "@/lib/redux/counterSlice";
import { toggleTheme } from "@/lib/redux/uiSlice";

describe("createDemoStore", () => {
  it("combines counter and ui slices", () => {
    const store = createDemoStore();
    const state = store.getState();

    expect(state.counter).toBeDefined();
    expect(state.ui).toBeDefined();
    expect(state.counter.count).toBe(0);
    expect(state.ui.theme).toBe("light");
  });

  it("updates slices independently", () => {
    const store = createDemoStore();
    store.dispatch(increment());
    store.dispatch(toggleTheme());

    expect(store.getState().counter.count).toBe(1);
    expect(store.getState().ui.theme).toBe("dark");
  });
});
