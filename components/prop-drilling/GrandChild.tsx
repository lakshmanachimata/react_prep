"use client";

import { useEffect, useState } from "react";
import type { UserProps } from "@/components/prop-drilling/types";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

export default function GrandChild({ name, age, gender }: UserProps) {
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("GrandChild", { name, age, gender });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="prop-grandchild">
      {mounted && <RenderDebugBadge name="GrandChild" count={count} />}
      <h3>User profile</h3>
      <ul className="prop-user-list">
        <li>
          <strong>Name:</strong> {name}
        </li>
        <li>
          <strong>Age:</strong> {age}
        </li>
        <li>
          <strong>Gender:</strong> {gender}
        </li>
      </ul>
    </div>
  );
}
