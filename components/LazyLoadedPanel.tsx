"use client";

import { memo } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

function LazyLoadedPanel() {
  const { count } = useRenderDebug("LazyLoadedPanel");

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="LazyLoadedPanel" count={count} />
      <h3>Lazy-loaded panel</h3>
      <p>
        This component lives in a separate chunk loaded by{" "}
        <code>React.lazy()</code>.
      </p>
    </div>
  );
}

export default memo(LazyLoadedPanel);
