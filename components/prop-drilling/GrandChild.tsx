"use client";

import { useEffect, useRef, useState } from "react";
import type { UserProps } from "@/components/prop-drilling/types";

export default function GrandChild({ name, age, gender }: UserProps) {
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[GrandChild] render #${renderCount.current}`, {
    name,
    age,
    gender,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="prop-grandchild">
      {mounted && (
        <p className="welcome-render-count">
          GrandChild render #{renderCount.current}
        </p>
      )}
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
