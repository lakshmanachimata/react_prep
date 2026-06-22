"use client";

import { useEffect, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type WelcomeProps = {
  name?: string;
  message?: string;
};

export default function Welcome({
  name = "Guest",
  message = "Welcome to your Next.js app.",
}: WelcomeProps) {
  const [mounted, setMounted] = useState(false);
  const { count } = useRenderDebug("Welcome", { name, message });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="welcome-debug">
      {mounted && <RenderDebugBadge name="Welcome" count={count} />}
      <h1>Hello, {name}!</h1>
      <p>{message}</p>
    </section>
  );
}
