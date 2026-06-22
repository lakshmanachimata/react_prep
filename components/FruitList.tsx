"use client";

import { memo, useEffect, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type FruitListProps = {
  fruits: string[];
};

function FruitList({ fruits }: FruitListProps) {
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("FruitList", {
    count: fruits.length,
    fruits,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fruit-debug fruit-list-debug">
      {mounted && <RenderDebugBadge name="FruitList" count={count} />}
      <h2>Fruits ({fruits.length})</h2>
      {fruits.length === 0 ? (
        <p className="fruit-empty">No fruits match your search.</p>
      ) : (
        <ul className="fruit-list">
          {fruits.map((fruit) => (
            <li key={fruit}>{fruit}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function fruitsAreEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((fruit, index) => fruit === b[index]);
}

export default memo(FruitList, (prev, next) =>
  fruitsAreEqual(prev.fruits, next.fruits),
);
