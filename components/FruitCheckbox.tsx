"use client";

import { useEffect, useRef, useState } from "react";

type FruitCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function FruitCheckbox({ checked, onChange }: FruitCheckboxProps) {
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[FruitCheckbox] render #${renderCount.current}`, { checked });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="fruit-debug fruit-checkbox-debug">
      {mounted && (
        <p className="welcome-render-count">
          FruitCheckbox render #{renderCount.current}
        </p>
      )}
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
