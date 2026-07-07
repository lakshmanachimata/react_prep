"use client";

import { memo, useOptimistic, useState, useTransition } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function UseOptimisticDemo() {
  // Source of truth — updated after the fake network call finishes.
  const [messages, setMessages] = useState<string[]>([]);
  // Derived "preview" state shown immediately; reverts/syncs when messages updates.
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, newMessage: string) => [...current, `${newMessage} (sending…)`],
  );
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const { count } = useRenderDebug("UseOptimisticDemo", {
    messages,
    optimisticMessages,
    isPending,
  });

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setDraft("");
    startTransition(() => {
      // UI updates instantly with "(sending…)" suffix.
      addOptimistic(text);
      void delay(2000).then(() => {
        // Real state commit replaces the optimistic entry.
        setMessages((current) => [...current, text]);
      });
    });
  }

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseOptimisticDemo" count={count} />
      <h2>useOptimistic (React 19)</h2>
      <p className="drill-description">
        Show the expected UI immediately while an async action finishes. When
        real state arrives, React swaps the optimistic version for the truth.
      </p>
      <form className="prop-user-form" onSubmit={handleSend}>
        <label>
          Message
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
          />
        </label>
        <button type="submit" disabled={isPending}>
          {isPending ? "Sending…" : "Send"}
        </button>
      </form>
      {/* Render optimisticMessages, not messages — user sees instant feedback. */}
      <ul className="fruit-list">
        {optimisticMessages.map((message, index) => (
          <li key={`${message}-${index}`}>{message}</li>
        ))}
      </ul>
      {optimisticMessages.length === 0 && (
        <p className="state-demo-note">No messages yet.</p>
      )}
    </section>
  );
}

export default memo(UseOptimisticDemo);
