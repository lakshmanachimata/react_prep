"use client";

import { memo, useId } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

// Reusable field — each instance calls useId() and gets its own stable id.
function LabeledField({ label, type = "text" }: { label: string; type?: string }) {
  // Same id on server and client; survives re-renders; unique per mount.
  const id = useId();
  const { count } = useRenderDebug(`LabeledField:${label}`);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name={`LabeledField:${label}`} count={count} />
      {/* htmlFor + id link label click to input focus (accessibility). */}
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} name={id} />
      <p className="state-demo-note">
        Generated id: <code>{id}</code>
      </p>
    </div>
  );
}

function UseIdDemo() {
  const { count } = useRenderDebug("UseIdDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseIdDemo" count={count} />
      <h2>useId playground</h2>
      <p className="drill-description">
        <code>useId()</code> creates a stable, unique id per component instance —
        safe for SSR/hydration and for wiring <code>label htmlFor</code> to{" "}
        <code>input id</code> without manual counters.
      </p>
      {/* Two instances → two different ids; no global counter or Math.random(). */}
      <div className="keys-demo-columns">
        <LabeledField label="Email" type="email" />
        <LabeledField label="Phone" type="tel" />
      </div>
    </section>
  );
}

// memo: parent checkbox toggles in HookDemosSection won't re-render this tree.
export default memo(UseIdDemo);
