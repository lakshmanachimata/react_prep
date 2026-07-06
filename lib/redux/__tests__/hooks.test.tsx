import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createDemoStore } from "@/lib/redux/store";
import { increment } from "@/lib/redux/counterSlice";

function createWrapper() {
  const store = createDemoStore();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe("redux hooks", () => {
  it("useAppSelector reads counter state", () => {
    const { result } = renderHook(() => useAppSelector((s) => s.counter.count), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBe(0);
  });

  it("useAppDispatch updates store", () => {
    const store = createDemoStore();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    result.current(increment());
    expect(store.getState().counter.count).toBe(1);
  });
});
