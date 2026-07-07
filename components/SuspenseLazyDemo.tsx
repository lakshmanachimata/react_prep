"use client";

import { lazy, memo, Suspense, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

// Artificial delay so the Suspense fallback is visible in the demo.
function delayImport<T>(loader: () => Promise<T>, ms: number) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(loader()), ms);
  });
}

// lazy() returns a component that suspends until import() resolves.
const LazyLoadedPanel = lazy(() =>
  delayImport(() => import("@/components/LazyLoadedPanel"), 2000),
);

function SuspenseLazyDemo() {
  const [showLazy, setShowLazy] = useState(false);
  const { count } = useRenderDebug("SuspenseLazyDemo", { showLazy });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="SuspenseLazyDemo" count={count} />
      <h2>Suspense + React.lazy</h2>
      <p className="drill-description">
        <code>React.lazy</code> code-splits a component.{" "}
        <code>&lt;Suspense&gt;</code> shows fallback UI while the chunk loads.
        Contrast with <code>next/dynamic</code> used elsewhere in this app.
      </p>
      <label className="effect-demo-toggle">
        <input
          type="checkbox"
          checked={showLazy}
          onChange={(event) => setShowLazy(event.target.checked)}
        />
        Mount lazy panel
      </label>
      {/* Suspense catches the suspend thrown by lazy() and shows fallback. */}
      {showLazy && (
        <Suspense fallback={<p className="state-demo-note">Loading chunk…</p>}>
          <LazyLoadedPanel />
        </Suspense>
      )}
    </section>
  );
}

export default memo(SuspenseLazyDemo);
