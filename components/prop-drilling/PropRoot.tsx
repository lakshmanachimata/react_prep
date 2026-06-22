"use client";

import { useEffect, useRef, useState } from "react";
import Child from "@/components/prop-drilling/Child";

export default function PropRoot() {
  const [name, setName] = useState("Alex");
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("Non-binary");
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[PropRoot] render #${renderCount.current}`, {
    name,
    age,
    gender,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="prop-root">
      {mounted && (
        <p className="welcome-render-count">
          PropRoot render #{renderCount.current}
        </p>
      )}
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
