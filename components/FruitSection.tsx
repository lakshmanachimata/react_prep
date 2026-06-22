"use client";

import { useState } from "react";
import FruitCheckbox from "@/components/FruitCheckbox";
import FruitSearchPanel from "@/components/FruitSearchPanel";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

export default function FruitSection() {
  const [showFruits, setShowFruits] = useState(false);
  const { count } = useRenderDebug("FruitSection", { showFruits });

  return (
    <section className="fruit-section">
      <RenderDebugBadge name="FruitSection" count={count} />
      <FruitCheckbox checked={showFruits} onChange={setShowFruits} />
      {showFruits && <FruitSearchPanel />}
    </section>
  );
}
