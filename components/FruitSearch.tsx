"use client";

import { useEffect, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type FruitSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FruitSearch({ value, onChange }: FruitSearchProps) {
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("FruitSearch", { value });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fruit-debug fruit-search-debug">
      {mounted && <RenderDebugBadge name="FruitSearch" count={count} />}
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
