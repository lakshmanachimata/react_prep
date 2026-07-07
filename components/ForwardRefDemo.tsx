"use client";

import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type Ref,
} from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

// Small public API the parent is allowed to call — not the raw DOM node.
export type FancyInputHandle = {
  focus: () => void;
  clear: () => void;
};

type FancyInputProps = {
  label: string;
  ref?: Ref<FancyInputHandle>;
};

// forwardRef passes the parent's ref into this component as the second argument.
const FancyInput = forwardRef<FancyInputHandle, Omit<FancyInputProps, "ref">>(
  function FancyInput({ label }, ref) {
    // Internal ref — parent never touches the DOM directly.
    const inputRef = useRef<HTMLInputElement>(null);
    const { count } = useRenderDebug("FancyInput");

    // Customize what parentRef.current exposes (focus/clear only).
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        if (inputRef.current) inputRef.current.value = "";
      },
    }));

    return (
      <div className="state-demo-panel">
        <RenderDebugBadge name="FancyInput" count={count} />
        <label>
          {label}
          <input ref={inputRef} type="text" placeholder="Type here..." />
        </label>
      </div>
    );
  },
);

function ForwardRefDemo() {
  // Parent holds a ref to FancyInputHandle, not HTMLInputElement.
  const inputRef = useRef<FancyInputHandle>(null);
  const { count } = useRenderDebug("ForwardRefDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="ForwardRefDemo" count={count} />
      <h2>forwardRef + useImperativeHandle</h2>
      <p className="drill-description">
        Parents usually pass props down. Sometimes you need to call a child method
        (focus, scroll, play). <code>useImperativeHandle</code> exposes a small
        API through the ref instead of leaking the whole DOM node.
      </p>
      <FancyInput ref={inputRef} label="Child input" />
      <div className="effect-demo-controls">
        {/* Imperative calls — no extra props or state lift needed for focus/clear. */}
        <button type="button" onClick={() => inputRef.current?.focus()}>
          Focus child
        </button>
        <button type="button" onClick={() => inputRef.current?.clear()}>
          Clear child
        </button>
      </div>
    </section>
  );
}

export default memo(ForwardRefDemo);
