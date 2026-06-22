"use client";

import { useEffect, useState } from "react";
import GrandChild from "@/components/prop-drilling/GrandChild";
import type { UserProps } from "@/components/prop-drilling/types";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

export default function Child({ name, age, gender }: UserProps) {
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("Child", { name, age, gender });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="prop-child">
      {mounted && <RenderDebugBadge name="Child" count={count} />}
      <p className="drill-pass-through">Passing: name, age, gender</p>
      <GrandChild name={name} age={age} gender={gender} />
    </div>
  );
}
