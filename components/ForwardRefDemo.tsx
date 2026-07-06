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

export type FancyInputHandle = {
  focus: () => void;
  clear: () => void;
};

type FancyInputProps = {
  label: string;
  ref?: Ref<FancyInputHandle>;
};

// forwardRef lets a parent hold a ref to a child’s imperative API.
const FancyInput = forwardRef<FancyInputHandle, Omit<FancyInputProps, "ref">>(
  function FancyInput({ label }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { count } = useRenderDebug("FancyInput");

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
