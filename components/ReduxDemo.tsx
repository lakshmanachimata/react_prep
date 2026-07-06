"use client";

import { memo, useMemo, type ReactNode } from "react";
import { Provider } from "react-redux";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { decrement, fetchBonus, increment, reset } from "@/lib/redux/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectCounterSummary, selectDoubleCount } from "@/lib/redux/selectors";
import { createDemoStore } from "@/lib/redux/store";
import { toggleTheme } from "@/lib/redux/uiSlice";

function ReduxCountDisplay() {
  const count = useAppSelector((state) => state.counter.count);
  const { count: renders } = useRenderDebug("ReduxCountDisplay", { count });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxCountDisplay" count={renders} />
      <h3>Count (deep leaf)</h3>
      <p>
        Reads <code>state.counter.count</code> via <code>useAppSelector</code>.
      </p>
      <p>
        count: <strong>{count}</strong>
      </p>
    </div>
  );
}

function ReduxActionDisplay() {
  const lastAction = useAppSelector((state) => state.counter.lastAction);
  const { count: renders } = useRenderDebug("ReduxActionDisplay", { lastAction });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxActionDisplay" count={renders} />
      <h3>Last action (deep leaf)</h3>
      <p>Subscribes only to <code>lastAction</code>.</p>
      <p>
        last action: <strong>{lastAction}</strong>
      </p>
    </div>
  );
}

function ReduxLabelDisplay() {
  const label = useAppSelector((state) => state.counter.label);
  const { count: renders } = useRenderDebug("ReduxLabelDisplay", { label });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxLabelDisplay" count={renders} />
      <h3>Static label (deep leaf)</h3>
      <p>Render count should stay at 1 while you click counter buttons.</p>
      <p>
        label: <strong>{label}</strong>
      </p>
    </div>
  );
}

function ReduxDeepLayer({ children }: { children: ReactNode }) {
  const { count: renders } = useRenderDebug("ReduxDeepLayer");

  return (
    <div className="redux-demo-layer">
      <RenderDebugBadge name="ReduxDeepLayer" count={renders} />
      <p className="state-demo-note">Middle layer — passes no counter props down.</p>
      {children}
    </div>
  );
}

function ReduxToolbar() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.counter.status);
  const { count: renders } = useRenderDebug("ReduxToolbar", { status });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxToolbar" count={renders} />
      <h3>1. Slice + dispatch</h3>
      <p>
        <code>useAppDispatch</code> + RTK action creators from{" "}
        <code>counterSlice</code>.
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={() => dispatch(decrement())}>
          -1
        </button>
        <button type="button" onClick={() => dispatch(increment())}>
          +1
        </button>
        <button type="button" onClick={() => dispatch(reset())}>
          Reset
        </button>
        <button
          type="button"
          disabled={status === "loading"}
          onClick={() => dispatch(fetchBonus())}
        >
          {status === "loading" ? "Fetching bonus..." : "Async +5 bonus"}
        </button>
      </div>
    </div>
  );
}

function ReduxThemePanel() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const { count: renders } = useRenderDebug("ReduxThemePanel", { theme });

  return (
    <div className={`state-demo-panel redux-theme-panel redux-theme-${theme}`}>
      <RenderDebugBadge name="ReduxThemePanel" count={renders} />
      <h3>2. Multiple slices</h3>
      <p>
        <code>ui</code> slice is separate from <code>counter</code>. Toggle theme
        here without touching counter state.
      </p>
      <p>
        theme: <strong>{theme}</strong>
      </p>
      <button type="button" onClick={() => dispatch(toggleTheme())}>
        Toggle theme
      </button>
    </div>
  );
}

function ReduxSelectorPanel() {
  const doubleCount = useAppSelector(selectDoubleCount);
  const summary = useAppSelector(selectCounterSummary);
  const { count: renders } = useRenderDebug("ReduxSelectorPanel", {
    doubleCount,
    summary,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxSelectorPanel" count={renders} />
      <h3>3. Memoized selectors</h3>
      <p>
        <code>createSelector</code> derives values from one or more slices. Re-runs
        only when inputs change.
      </p>
      <p>
        double count: <strong>{doubleCount}</strong>
      </p>
      <p>
        cross-slice summary: <strong>{summary}</strong>
      </p>
    </div>
  );
}

function ReduxDemoTree() {
  const { count: renders } = useRenderDebug("ReduxDemoTree");

  return (
    <>
      <RenderDebugBadge name="ReduxDemoTree" count={renders} />
      <ReduxToolbar />
      <ReduxThemePanel />
      <ReduxSelectorPanel />
      <ReduxDeepLayer>
        <ReduxDeepLayer>
          <div className="redux-demo-leaves">
            <ReduxCountDisplay />
            <ReduxActionDisplay />
            <ReduxLabelDisplay />
          </div>
        </ReduxDeepLayer>
      </ReduxDeepLayer>
    </>
  );
}

function ReduxDemo() {
  const store = useMemo(() => createDemoStore(), []);
  const { count: renders } = useRenderDebug("ReduxDemo");

  return (
    <section className="effect-demo state-demo redux-demo">
      <RenderDebugBadge name="ReduxDemo" count={renders} />
      <h2>Redux playground</h2>
      <p className="drill-description">
        Redux Toolkit patterns: slices, async thunks, multiple reducers, memoized
        selectors, and selective subscriptions via <code>useAppSelector</code>.
      </p>

      <div className="state-demo-panel">
        <h3>Patterns in this demo</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>createSlice</strong> — reducers + auto action creators
          </li>
          <li>
            <strong>createAsyncThunk</strong> — async bonus fetch with pending /
            fulfilled states
          </li>
          <li>
            <strong>Multiple slices</strong> — <code>counter</code> + <code>ui</code>{" "}
            in one store
          </li>
          <li>
            <strong>createSelector</strong> — derived + cross-slice values
          </li>
          <li>
            <strong>Provider</strong> — global store for the tree (contrast with
            Zustand — no provider needed)
          </li>
        </ul>
      </div>

      <Provider store={store}>
        <ReduxDemoTree />
      </Provider>
    </section>
  );
}

export default memo(ReduxDemo);
