"use client";

import { useEffect, useState } from "react";
import Child from "@/components/prop-drilling/Child";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

export default function PropRoot() {
  const [name, setName] = useState("Alex");
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("Non-binary");
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("PropRoot", { name, age, gender });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="prop-root">
      {mounted && <RenderDebugBadge name="PropRoot" count={count} />}
      <h2>Prop Drilling</h2>
      <p className="drill-description">
        User info lives in PropRoot. Child passes name, age, and gender down to
        GrandChild even though Child never uses them. Edit a field and watch all
        three re-render.
      </p>
      <form
        className="prop-user-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Age
          <input
            type="number"
            min={1}
            value={age}
            onChange={(event) => setAge(Number(event.target.value) || 0)}
          />
        </label>
        <label>
          Gender
          <input
            type="text"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          />
        </label>
      </form>
      <Child name={name} age={age} gender={gender} />
    </section>
  );
}
