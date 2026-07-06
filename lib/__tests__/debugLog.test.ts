import { debugLog } from "@/lib/debugLog";

describe("debugLog", () => {
  const originalWindow = global.window;

  afterEach(() => {
    jest.restoreAllMocks();
    global.window = originalWindow;
  });

  it("logs in browser environment", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    debugLog("hello", 123);
    expect(spy).toHaveBeenCalledWith("hello", 123);
  });

  // SSR branch (`typeof window === "undefined"`) is not simulated in jsdom.
});
