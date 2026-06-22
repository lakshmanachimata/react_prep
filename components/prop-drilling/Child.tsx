"use client";

import { useEffect, useRef, useState } from "react";
import GrandChild from "@/components/prop-drilling/GrandChild";
import type { UserProps } from "@/components/prop-drilling/types";

export default function Child({ name, age, gender }: UserProps) {
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[Child] render #${renderCount.current}`, { name, age, gender });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="prop-child">
      {mounted && (
        <p className="welcome-render-count">
          Child render #{renderCount.current}
        </p>
      )}
      <p className="drill-pass-through">
        Passing: name, age, gender
      </p>
      <GrandChild name={name} age={age} gender={gender} />
    </div>
  );
}
