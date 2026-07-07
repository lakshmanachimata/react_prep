"use client";

import { memo, useRef, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

function ControlledVsUncontrolledDemo() {
  // React is the single source of truth — every keystroke updates state.
  const [controlled, setControlled] = useState("React");
  // Ref points at DOM node; value lives in the input, not in React state.
  const uncontrolledRef = useRef<HTMLInputElement>(null);
  const { count } = useRenderDebug("ControlledVsUncontrolledDemo", {
    controlled,
  });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="ControlledVsUncontrolledDemo" count={count} />
      <h2>Controlled vs uncontrolled inputs</h2>
      <p className="drill-description">
        <strong>Controlled:</strong> React owns the value via{" "}
        <code>value</code> + <code>onChange</code>.{" "}
        <strong>Uncontrolled:</strong> the DOM owns it; read with a ref or{" "}
        <code>FormData</code> on submit.
      </p>
      <div className="keys-demo-columns">
        <div className="state-demo-panel">
          <h3>Controlled</h3>
          {/* value + onChange: React re-renders on every keystroke. */}
          <input
            type="text"
            value={controlled}
            onChange={(event) => setControlled(event.target.value)}
          />
          <p className="state-demo-note">
            React state: <code>{controlled}</code>
          </p>
          <button type="button" onClick={() => setControlled("")}>
            Clear via state
          </button>
        </div>
        <div className="state-demo-panel">
          <h3>Uncontrolled</h3>
          {/* defaultValue sets initial DOM value only; React does not track changes. */}
          <input
            ref={uncontrolledRef}
            type="text"
            defaultValue="React"
            key="uncontrolled-demo"
          />
          <p className="state-demo-note">
            DOM value (read on demand): shown after clicking below
          </p>
          <button
            type="button"
            onClick={() => {
              const value = uncontrolledRef.current?.value ?? "";
              window.alert(`DOM value: ${value}`);
            }}
          >
            Read DOM value
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(ControlledVsUncontrolledDemo);
