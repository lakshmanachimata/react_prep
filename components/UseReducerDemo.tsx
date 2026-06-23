"use client";

import { memo, useReducer } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

// Single state object — useful when several fields update together.
type CounterState = {
  count: number;
  lastAction: string;
};

// Discriminated union: `type` tells the reducer which transition to apply.
type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "nothing" };

// Pure reducer: (currentState, action) => nextState. No side effects here.
function counterReducer(
  state: CounterState,
  action: CounterAction,
): CounterState {
  switch (action.type) {
    case "increment":
      // Always return a new object — never mutate `state` in place.
      return { count: state.count + 1, lastAction: "increment" };
    case "decrement":
      return { count: state.count - 1, lastAction: "decrement" };
    case "reset": {
        const next = { count: 0, lastAction: "reset" };
        if (state.count === next.count && state.lastAction === next.lastAction) {
          return state;
        }
        return next;
      }
    default:
      // Exhaustiveness guard; unreachable if every action type is handled above.
      return state;
  }
}

function CounterPanel() {
  // Like useState, but updates flow through dispatch(action) → reducer → new state.
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    lastAction: "none",
  });
  const { count: renders } = useRenderDebug("CounterPanel", state);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="CounterPanel" count={renders} />
      <h3>Counter reducer</h3>
      <p>
        count: <strong>{state.count}</strong>, last action:{" "}
        <strong>{state.lastAction}</strong>
      </p>
      <div className="effect-demo-controls">
        {/* dispatch sends a plain action object; the reducer decides the next state */}
        <button type="button" onClick={() => dispatch({ type: "decrement" })}>
          -1
        </button>
        <button type="button" onClick={() => dispatch({ type: "increment" })}>
          +1
        </button>
        <button type="button" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </button>
        <button type="button" onClick={() => dispatch({ type: "nothing" })}>
          Do nothing
        </button>
      </div>
    </div>
  );
}

function UseReducerDemo() {
  const { count: renders } = useRenderDebug("UseReducerDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseReducerDemo" count={renders} />
      <h2>useReducer playground</h2>
      <p className="drill-description">
        <code>useReducer</code> handles state transitions through a predictable
        reducer function instead of many <code>useState</code> calls.
      </p>
      <CounterPanel />
    </section>
  );
}

// Skips re-rendering this shell when HookDemosSection re-renders with the same props (none here).
export default memo(UseReducerDemo);
