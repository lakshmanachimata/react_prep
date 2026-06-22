"use client";

import { memo, useDeferredValue, useMemo, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const WORDS = Array.from({ length: 120 }, (_, index) => `word-${index + 1}`);

function DeferredListPanel({
  query,
  deferredQuery,
}: {
  query: string;
  deferredQuery: string;
}) {
  const { count: renders } = useRenderDebug("DeferredListPanel", {
    query,
    deferredQuery,
  });

  const filtered = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) return WORDS;
    return WORDS.filter((word) => word.includes(normalized));
  }, [deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="DeferredListPanel" count={renders} />
      <h3>Deferred filter</h3>
      <p>
        query: <strong>{query || "(empty)"}</strong>
      </p>
      <p>
        deferredQuery: <strong>{deferredQuery || "(empty)"}</strong>
      </p>
      <p>{isStale ? "List is catching up..." : "List is in sync"}</p>
      <ul className="fruit-list">
        {filtered.slice(0, 12).map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

function UseDeferredValueDemo() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { count: renders } = useRenderDebug("UseDeferredValueDemo", {
    query,
    deferredQuery,
  });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseDeferredValueDemo" count={renders} />
      <h2>useDeferredValue playground</h2>
      <p className="drill-description">
        <code>useDeferredValue</code> lags behind the real state so React can
        keep the UI responsive while the expensive part catches up.
      </p>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type quickly..."
      />
      <DeferredListPanel query={query} deferredQuery={deferredQuery} />
    </section>
  );
}

export default memo(UseDeferredValueDemo);
