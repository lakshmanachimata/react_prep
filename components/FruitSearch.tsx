"use client";

import { useEffect, useRef, useState } from "react";

type FruitSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FruitSearch({ value, onChange }: FruitSearchProps) {
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[FruitSearch] render #${renderCount.current}`, { value });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fruit-debug fruit-search-debug">
      {mounted && (
        <p className="welcome-render-count">
          FruitSearch render #{renderCount.current}
        </p>
      )}
      <form className="name-form" onSubmit={(event) => event.preventDefault()}>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search fruits..."
          aria-label="Search fruits"
        />
      </form>
    </section>
  );
}
