"use client";

import { memo, useActionState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type SaveState = {
  error: string | null;
  message: string | null;
};

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function saveName(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const name = String(formData.get("name") ?? "").trim();
  await delay(700);

  if (!name) {
    return { error: "Name is required", message: null };
  }

  if (name.toLowerCase() === "error") {
    return { error: "Server rejected that name", message: null };
  }

  return { error: null, message: `Saved: ${name}` };
}

function UseActionStateDemo() {
  const [state, formAction, isPending] = useActionState(saveName, {
    error: null,
    message: null,
  });
  const { count } = useRenderDebug("UseActionStateDemo", { state, isPending });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseActionStateDemo" count={count} />
      <h2>useActionState (React 19)</h2>
      <p className="drill-description">
        Form actions get pending state and returned result in one hook — useful
        for async submits without manual <code>useState</code> for loading and
        errors. Try submitting empty or the word <code>error</code>.
      </p>
      <form className="prop-user-form" action={formAction}>
        <label>
          Name
          <input type="text" name="name" placeholder="Your name" />
        </label>
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </button>
      </form>
      {state.error && <p className="keys-demo-error">{state.error}</p>}
      {state.message && <p className="state-demo-note">{state.message}</p>}
    </section>
  );
}

export default memo(UseActionStateDemo);
