"use client";

import { memo, useReducer } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type CounterState = {
  count: number;
  lastAction: string;
};

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };

function counterReducer(
  state: CounterState,
  action: CounterAction,
): CounterState {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1, lastAction: "increment" };
    case "decrement":
      return { count: state.count - 1, lastAction: "decrement" };
    case "reset":
      return { count: 0, lastAction: "reset" };
    default:
      return state;
  }
}

function CounterPanel() {
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
        <button type="button" onClick={() => dispatch({ type: "decrement" })}>
          -1
        </button>
        <button type="button" onClick={() => dispatch({ type: "increment" })}>
          +1
        </button>
        <button type="button" onClick={() => dispatch({ type: "reset" })}>
          Reset
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

export default memo(UseReducerDemo);
