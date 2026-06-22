"use client";

import { useEffect, useRef, useState } from "react";

type WelcomeProps = {
  name?: string;
  message?: string;
};

export default function Welcome({
  name = "Guest",
  message = "Welcome to your Next.js app.",
}: WelcomeProps) {
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`[Welcome] render #${renderCount.current}`, { name, message });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="welcome-debug">
      {mounted && (
        <p className="welcome-render-count">Render #{renderCount.current}</p>
      )}
      <h1>Hello, {name}!</h1>
      <p>{message}</p>
    </section>
  );
}
