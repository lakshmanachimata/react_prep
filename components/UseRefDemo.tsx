"use client";

import { memo, useRef, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { debugLog } from "@/lib/debugLog";

function RefCounterPanel() {
  const refClicks = useRef(0);
  const [display, setDisplay] = useState(0);
  const { count: renders } = useRenderDebug("RefCounterPanel", { display });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="RefCounterPanel" count={renders} />
      <h3>Ref counter</h3>
      <p>
        Updating <code>ref.current</code> does not re-render. State is only for
        displaying the ref value.
      </p>
      <p>
        ref clicks: <strong>{display}</strong>
      </p>
      <div className="effect-demo-controls">
        <button
          type="button"
          onClick={() => {
            refClicks.current += 1;
            debugLog("[RefCounterPanel] ref +1, no re-render");
          }}
        >
          Ref +1 (no re-render)
        </button>
        <button type="button" onClick={() => setDisplay(refClicks.current)}>
          Show ref value (re-renders)
        </button>
      </div>
    </div>
  );
}

function DomRefPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { count: renders } = useRenderDebug("DomRefPanel");

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="DomRefPanel" count={renders} />
      <h3>DOM ref</h3>
      <p>
        <code>useRef</code> can point at a DOM node for imperative actions like
        focus.
      </p>
      <input ref={inputRef} type="text" placeholder="Focus me" />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus input
      </button>
    </div>
  );
}

function PreviousValuePanel() {
  const [count, setCount] = useState(0);
  const previous = useRef<number | null>(null);
  const { count: renders } = useRenderDebug("PreviousValuePanel", { count });

  const lastValue = previous.current;
  previous.current = count;

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="PreviousValuePanel" count={renders} />
      <h3>Previous value ref</h3>
      <p>
        current: <strong>{count}</strong>, previous:{" "}
        <strong>{lastValue ?? "none"}</strong>
      </p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        +1
      </button>
    </div>
  );
}

function UseRefDemo() {
  const { count: renders } = useRenderDebug("UseRefDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseRefDemo" count={renders} />
      <h2>useRef playground</h2>
      <p className="drill-description">
        Refs store mutable values that survive re-renders without causing them.
      </p>
      <RefCounterPanel />
      <DomRefPanel />
      <PreviousValuePanel />
    </section>
  );
}

export default memo(UseRefDemo);
