"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type NameFormProps = {
  onSubmit: (name: string) => void;
  onNameChange: (name: string) => void;
  throttleMs?: number;
};

export default function NameForm({
  onSubmit,
  onNameChange,
  throttleMs = 300,
}: NameFormProps) {
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const renderCount = useRef(0);
  const lastRan = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingValue = useRef(input);

  renderCount.current += 1;
  console.log(`[NameForm] render #${renderCount.current}`, { input });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function notifyParent(value: string) {
    onNameChange(value.trim() || "Guest");
  }

  function flushThrottle(value: string) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    lastRan.current = Date.now();
    notifyParent(value);
  }

  function scheduleThrottledUpdate(value: string) {
    pendingValue.current = value;
    const now = Date.now();
    const elapsed = now - lastRan.current;

    if (elapsed >= throttleMs) {
      flushThrottle(value);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      lastRan.current = Date.now();
      console.log(`[NameForm] flushThrottle #${renderCount.current}`, { pendingValue: pendingValue.current });
      notifyParent(pendingValue.current);
    }, throttleMs - elapsed);
  }

  function handleChange(value: string) {
    setInput(value);
    scheduleThrottledUpdate(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    flushThrottle(input);
    onSubmit(input.trim() || "Guest");
  }

  return (
    <section className="welcome-debug name-form-debug">
      {mounted && (
        <p className="welcome-render-count">NameForm render #{renderCount.current}</p>
      )}
      <form className="name-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Enter your name"
          aria-label="Your name"
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
