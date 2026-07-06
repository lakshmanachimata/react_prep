"use client";

import { memo, useRef, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

function ControlledVsUncontrolledDemo() {
  const [controlled, setControlled] = useState("React");
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
