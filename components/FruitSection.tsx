"use client";

import { useMemo, useState } from "react";
import FruitCheckbox from "@/components/FruitCheckbox";
import FruitList from "@/components/FruitList";
import FruitSearch from "@/components/FruitSearch";

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

export default function FruitSection() {
  const [showFruits, setShowFruits] = useState(false);
  const [query, setQuery] = useState("");

  const filteredFruits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ALL_FRUITS;

    return ALL_FRUITS.filter((fruit) =>
      fruit.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <>
      <FruitCheckbox checked={showFruits} onChange={setShowFruits} />
      {showFruits && (
        <>
          <FruitSearch value={query} onChange={setQuery} />
          <FruitList fruits={filteredFruits} />
        </>
      )}
    </>
  );
}
