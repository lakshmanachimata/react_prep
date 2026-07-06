import uiReducer, { setTheme, toggleTheme } from "@/lib/redux/uiSlice";

describe("uiSlice", () => {
  const initial = uiReducer(undefined, { type: "@@INIT" });

  it("starts with light theme", () => {
    expect(initial.theme).toBe("light");
  });

  it("toggleTheme switches light to dark", () => {
    const next = uiReducer(initial, toggleTheme());
    expect(next.theme).toBe("dark");
  });

  it("toggleTheme switches dark to light", () => {
    const dark = uiReducer(initial, toggleTheme());
    const next = uiReducer(dark, toggleTheme());
    expect(next.theme).toBe("light");
  });

  it("setTheme sets explicit theme", () => {
    const next = uiReducer(initial, setTheme("dark"));
    expect(next.theme).toBe("dark");
  });
});
