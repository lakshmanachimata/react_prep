"use client";

import { memo, useMemo, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { debugLog } from "@/lib/debugLog";

const NUMBERS = Array.from({ length: 20 }, (_, index) => index + 1);

// Simulates a slow calculation so memoization savings are noticeable.
function expensiveDouble(value: number) {
  let total = 0;
  for (let index = 0; index < 10000; index += 1) {
    total += value;
  }
  return total;
}

function MemoResultPanel({ input, bump }: { input: number; bump: number }) {
  const { count: renders } = useRenderDebug("MemoResultPanel", { input, bump });

  // Recalculates only when `input` changes — not when parent `bump` changes.
  // The component still re-renders when bump changes; useMemo only skips the work.
  const memoized = useMemo(() => {
    debugLog("[MemoResultPanel] useMemo recalculated");
    return expensiveDouble(input);
  }, [input]);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="MemoResultPanel" count={renders} />
      <h3>Memoized result</h3>
      <p>
        Parent bump: <strong>{bump}</strong> (ignored by useMemo)
      </p>
      <p>
        Input: <strong>{input}</strong>, memoized value: <strong>{memoized}</strong>
      </p>
      <p className="state-demo-note">
        Click &quot;Parent re-render&quot; — render count rises but useMemo should
        not recalculate (check console).
      </p>
    </div>
  );
}

function FilterMemoPanel() {
  const [query, setQuery] = useState("");
  const { count: renders } = useRenderDebug("FilterMemoPanel", { query });

  // Returns the same array reference while `query` is unchanged.
  // Helps avoid unnecessary work and keeps referential equality stable for children.
  const filtered = useMemo(() => {
    debugLog("[FilterMemoPanel] filtering numbers");
    const normalized = query.trim();
    if (!normalized) return NUMBERS;
    return NUMBERS.filter((number) => String(number).includes(normalized));
  }, [query]);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="FilterMemoPanel" count={renders} />
      <h3>Memoized filter</h3>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter numbers..."
      />
      <p>
        <code>{filtered.join(", ") || "No numbers match your query."}</code>
      </p>
    </div>
  );
}

function UseMemoDemo() {
  const [input, setInput] = useState(2);
  // `bump` exists only to force parent re-renders without changing memo deps.
  const [bump, setBump] = useState(0);
  const { count: renders } = useRenderDebug("UseMemoDemo", { input, bump });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseMemoDemo" count={renders} />
      <h2>useMemo playground</h2>
      <p className="drill-description">
        <code>useMemo</code> caches a computed value until dependencies change.
        It does not stop the component from re-rendering.
      </p>
      <div className="effect-demo-controls">
        {/* Changes `input` dep → useMemo recalculates */}
        <button type="button" onClick={() => setInput((value) => value + 1)}>
          Change input ({input})
        </button>
        {/* Changes only `bump` → child re-renders but useMemo should not rerun */}
        <button type="button" onClick={() => setBump((value) => value + 1)}>
          Parent re-render ({bump})
        </button>
      </div>
      <MemoResultPanel input={input} bump={bump} />
      <FilterMemoPanel />
    </section>
  );
}

// Skips re-rendering this shell when parent re-renders with the same props (none here).
export default memo(UseMemoDemo);
