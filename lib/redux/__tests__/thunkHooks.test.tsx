import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { useThunkDispatch, useThunkSelector } from "@/lib/redux/thunkHooks";
import { createThunkDemoStore } from "@/lib/redux/thunkStore";
import { clearUsersError } from "@/lib/redux/usersSlice";

describe("thunkHooks", () => {
  it("useThunkSelector reads users slice", () => {
    const store = createThunkDemoStore();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useThunkSelector((s) => s.users.status), {
      wrapper,
    });
    expect(result.current).toBe("idle");
  });

  it("useThunkDispatch dispatches actions", () => {
    const store = createThunkDemoStore();
    store.dispatch({ type: "users/loadUsers/rejected", payload: "err", error: {} });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useThunkDispatch(), { wrapper });
    result.current(clearUsersError());
    expect(store.getState().users.error).toBeNull();
  });
});
