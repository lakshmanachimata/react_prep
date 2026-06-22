"use client";

import { useEffect, useRef, useState } from "react";

type FruitListProps = {
  fruits: string[];
};

export default function FruitList({ fruits }: FruitListProps) {
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[FruitList] render #${renderCount.current}`, {
    count: fruits.length,
    fruits,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fruit-debug fruit-list-debug">
      {mounted && (
        <p className="welcome-render-count">
          FruitList render #{renderCount.current}
        </p>
      )}
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
