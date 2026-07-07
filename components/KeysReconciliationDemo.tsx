"use client";

import { memo, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type TodoItem = {
  id: string;
  label: string;
};

const INITIAL_ITEMS: TodoItem[] = [
  { id: "a", label: "Apple" },
  { id: "b", label: "Banana" },
  { id: "c", label: "Cherry" },
];

// Each row owns local input state — survives re-renders only if key is stable.
function TodoRow({ item }: { item: TodoItem }) {
  const [draft, setDraft] = useState(item.label);
  const { count } = useRenderDebug(`TodoRow:${item.id}`, { draft });

  return (
    <li className="keys-demo-row">
      <RenderDebugBadge name={`TodoRow:${item.id}`} count={count} />
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <span className="state-demo-note">id: {item.id}</span>
    </li>
  );
}

function KeyedList({
  title,
  items,
  useIndexAsKey,
}: {
  title: string;
  items: TodoItem[];
  useIndexAsKey: boolean;
}) {
  const { count } = useRenderDebug(title);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name={title} count={count} />
      <h3>{title}</h3>
      <ul className="keys-demo-list">
        {items.map((item, index) => (
          <TodoRow
            // index as key: after reverse, React reuses wrong component instances.
            // item.id as key: each row keeps its draft text across reorder.
            key={useIndexAsKey ? index : item.id}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
}

function KeysReconciliationDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const { count } = useRenderDebug("KeysReconciliationDemo");

  function reverseItems() {
    setItems((current) => [...current].reverse());
  }

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="KeysReconciliationDemo" count={count} />
      <h2>Keys &amp; reconciliation</h2>
      <p className="drill-description">
        React matches list items by <code>key</code>. Using the array index as
        key breaks local state when you reorder — inputs keep the wrong text.
        Stable ids preserve each row&apos;s state.
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={reverseItems}>
          Reverse list
        </button>
      </div>
      {/* Same data, side-by-side: edit a row, then reverse to see the difference. */}
      <div className="keys-demo-columns">
        <KeyedList
          title="Bad: key={index}"
          items={items}
          useIndexAsKey
        />
        <KeyedList
          title="Good: key={item.id}"
          items={items}
          useIndexAsKey={false}
        />
      </div>
    </section>
  );
}

export default memo(KeysReconciliationDemo);
