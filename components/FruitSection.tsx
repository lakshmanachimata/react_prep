"use client";

import { useState } from "react";
import FruitCheckbox from "@/components/FruitCheckbox";
import FruitSearchPanel from "@/components/FruitSearchPanel";

export default function FruitSection() {
  const [showFruits, setShowFruits] = useState(false);

  return (
    <>
      <FruitCheckbox checked={showFruits} onChange={setShowFruits} />
      {showFruits && <FruitSearchPanel />}
    </>
  );
}
