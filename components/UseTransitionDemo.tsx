"use client";

import { memo, useMemo, useState, useTransition } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const ITEMS = Array.from({ length: 12000 }, (_, index) => `fruit-${index + 1}`);

function TransitionListPanel({
  query,
  isPending,
}: {
  query: string;
  isPending: boolean;
}) {
  const { count: renders } = useRenderDebug("TransitionListPanel", {
    query,
    isPending,
  });

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ITEMS;
    return ITEMS.filter((item) => item.includes(normalized));
  }, [query]);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="TransitionListPanel" count={renders} />
      <h3>Filtered list</h3>
      <p>
        {isPending ? "Updating list..." : `Showing ${filtered.length} items`}
      </p>
      <ul className="fruit-list">
        {filtered.slice(0, 12).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {filtered.length > 12 && <p className="state-demo-note">…and more</p>}
    </div>
  );
}

function UseTransitionDemo() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const { count: renders } = useRenderDebug("UseTransitionDemo", {
    input,
    query,
    isPending,
  });

  function handleChange(value: string) {
    setInput(value);
    startTransition(() => {
      setQuery(value);
    });
  }

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseTransitionDemo" count={renders} />
      <h2>useTransition playground</h2>
      <p className="drill-description">
        Typing updates <code>input</code> urgently. The expensive filter update
        runs inside <code>startTransition</code> so the input stays responsive.
      </p>
      <input
        type="text"
        value={input}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Type to filter..."
      />
      <p>results state: <strong>{isPending ? "filtering..." : "ready"}</strong></p>
      <TransitionListPanel query={query} isPending={isPending} />
    </section>
  );
}

export default memo(UseTransitionDemo);
