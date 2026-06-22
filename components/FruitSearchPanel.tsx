"use client";

import { useMemo, useState } from "react";
import FruitList from "@/components/FruitList";
import FruitSearch from "@/components/FruitSearch";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const ALL_FRUITS = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

export default function FruitSearchPanel() {
  const [query, setQuery] = useState("");
  const { count } = useRenderDebug("FruitSearchPanel", { query });

  const filteredFruits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    console.log("FruitSearchPanel normalized", normalized);
    if (!normalized) return ALL_FRUITS;

    return ALL_FRUITS.filter((fruit) =>
      fruit.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <section className="fruit-search-panel">
      <RenderDebugBadge name="FruitSearchPanel" count={count} />
      <FruitSearch value={query} onChange={setQuery} />
      <FruitList fruits={filteredFruits} />
    </section>
  );
}
