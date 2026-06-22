"use client";

import { useEffect, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type FruitCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function FruitCheckbox({ checked, onChange }: FruitCheckboxProps) {
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("FruitCheckbox", { checked });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fruit-debug fruit-checkbox-debug">
      {mounted && <RenderDebugBadge name="FruitCheckbox" count={count} />}
      <label className="fruit-checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        Show fruits
      </label>
    </section>
  );
}
