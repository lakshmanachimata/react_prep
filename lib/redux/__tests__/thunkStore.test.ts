import { createThunkDemoStore } from "@/lib/redux/thunkStore";

describe("createThunkDemoStore", () => {
  it("has users slice only", () => {
    const store = createThunkDemoStore();
    const state = store.getState();

    expect(state.users).toBeDefined();
    expect(state.users.items).toEqual([]);
    expect(state.users.status).toBe("idle");
  });
});
