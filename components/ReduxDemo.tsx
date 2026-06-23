"use client";

import { memo, useMemo, type ReactNode } from "react";
import { Provider } from "react-redux";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { decrement, increment, reset } from "@/lib/redux/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createDemoStore } from "@/lib/redux/store";

// --- Leaf components (no counter props drilled from parents) ---

function ReduxCountDisplay() {
  // Selector picks one slice; component re-renders only when that slice changes.
  const count = useAppSelector((state) => state.counter.count);
  const { count: renders } = useRenderDebug("ReduxCountDisplay", { count });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxCountDisplay" count={renders} />
      <h3>Count (deep leaf)</h3>
      <p>
        Reads <code>state.counter.count</code> via <code>useAppSelector</code> — no
        props from parents.
      </p>
      <p>
        count: <strong>{count}</strong>
      </p>
    </div>
  );
}

function ReduxActionDisplay() {
  // Separate selector from count — each panel can subscribe to different fields.
  const lastAction = useAppSelector((state) => state.counter.lastAction);
  const { count: renders } = useRenderDebug("ReduxActionDisplay", { lastAction });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxActionDisplay" count={renders} />
      <h3>Last action (deep leaf)</h3>
      <p>
        Subscribes only to <code>lastAction</code>. Re-renders when that field
        changes.
      </p>
      <p>
        last action: <strong>{lastAction}</strong>
      </p>
    </div>
  );
}

function ReduxLabelDisplay() {
  // `label` never changes — selector result stays equal, so react-redux skips re-render.
  const label = useAppSelector((state) => state.counter.label);
  const { count: renders } = useRenderDebug("ReduxLabelDisplay", { label });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxLabelDisplay" count={renders} />
      <h3>Static label (deep leaf)</h3>
      <p>
        Selects a field that never updates. Render count should stay at 1 while
        you click counter buttons.
      </p>
      <p>
        label: <strong>{label}</strong>
      </p>
    </div>
  );
}

// --- Middle layers exist only to show "no prop drilling" ---

function ReduxDeepLayer({ children }: { children: ReactNode }) {
  // No useSelector here — still re-renders when an ancestor does, but needs no counter props.
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
  // Typed dispatch — sends action objects to the store (defined in counterSlice).
  const dispatch = useAppDispatch();
  const { count: renders } = useRenderDebug("ReduxToolbar");

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ReduxToolbar" count={renders} />
      <h3>Dispatch controls</h3>
      <p>
        <code>useAppDispatch</code> sends actions to the global store from any
        component.
      </p>
      <div className="effect-demo-controls">
        {/* increment()/decrement()/reset() are RTK action creators → dispatch({ type, ... }) */}
        <button type="button" onClick={() => dispatch(decrement())}>
          -1
        </button>
        <button type="button" onClick={() => dispatch(increment())}>
          +1
        </button>
        <button type="button" onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>
    </div>
  );
}

function ReduxDemoTree() {
  // Must render inside <Provider> — hooks below need the store from context.
  const { count: renders } = useRenderDebug("ReduxDemoTree");

  return (
    <>
      <RenderDebugBadge name="ReduxDemoTree" count={renders} />
      <ReduxToolbar />
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
  // One store for the whole demo tree; useMemo keeps the same instance across re-renders.
  // Fresh store per mount so toggling the demo off/on resets state.
  const store = useMemo(() => createDemoStore(), []);
  const { count: renders } = useRenderDebug("ReduxDemo");

  return (
    <section className="effect-demo state-demo redux-demo">
      <RenderDebugBadge name="ReduxDemo" count={renders} />
      <h2>Redux playground</h2>
      <p className="drill-description">
        Redux is global state built on the same reducer idea as{" "}
        <code>useReducer</code>, but with a single store any component can read
        or update via <code>useSelector</code> / <code>useDispatch</code>.
      </p>

      <div className="state-demo-panel">
        <h3>Why Redux?</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>Single source of truth</strong> — one store holds app state
            instead of scattered <code>useState</code> trees.
          </li>
          <li>
            <strong>No prop drilling</strong> — deep components subscribe directly;
            middle layers do not pass counter props (see render badges).
          </li>
          <li>
            <strong>Predictable updates</strong> — actions describe what happened;
            reducers compute the next state (easy to test and reason about).
          </li>
          <li>
            <strong>Selective subscriptions</strong> — components re-render only
            when their selected slice changes (<code>ReduxLabelDisplay</code> stays
            quiet).
          </li>
          <li>
            <strong>DevTools</strong> — time-travel debugging, action log, state
            inspection (Redux DevTools browser extension).
          </li>
          <li>
            <strong>Scales past one component</strong> — middleware, async thunks,
            RTK Query, multiple slices — when local <code>useReducer</code> or
            Context becomes hard to maintain.
          </li>
        </ul>
      </div>

      {/* Provider makes the store available to useAppSelector / useAppDispatch below */}
      <Provider store={store}>
        <ReduxDemoTree />
      </Provider>
    </section>
  );
}

// Skips re-rendering this shell when HookDemosSection re-renders with the same props (none here).
export default memo(ReduxDemo);
