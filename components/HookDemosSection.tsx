"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const UseRefDemo = dynamic(() => import("@/components/UseRefDemo"), { ssr: false });
const UseMemoDemo = dynamic(() => import("@/components/UseMemoDemo"), { ssr: false });
const UseCallbackDemo = dynamic(() => import("@/components/UseCallbackDemo"), {
  ssr: false,
});
const UseReducerDemo = dynamic(() => import("@/components/UseReducerDemo"), {
  ssr: false,
});
const UseTransitionDemo = dynamic(() => import("@/components/UseTransitionDemo"), {
  ssr: false,
});
const UseDeferredValueDemo = dynamic(
  () => import("@/components/UseDeferredValueDemo"),
  { ssr: false },
);
const UseLayoutEffectDemo = dynamic(
  () => import("@/components/UseLayoutEffectDemo"),
  { ssr: false },
);

type DemoToggle = {
  id: string;
  label: string;
  enabled: boolean;
  onChange: (checked: boolean) => void;
  content: React.ReactNode;
};

export default function HookDemosSection() {
  const [showRef, setShowRef] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [showReducer, setShowReducer] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showDeferred, setShowDeferred] = useState(false);
  const [showLayoutEffect, setShowLayoutEffect] = useState(false);
  const { count } = useRenderDebug("HookDemosSection");

  const demos: DemoToggle[] = [
    {
      id: "ref",
      label: "Show useRef demo",
      enabled: showRef,
      onChange: setShowRef,
      content: showRef && <UseRefDemo />,
    },
    {
      id: "memo",
      label: "Show useMemo demo",
      enabled: showMemo,
      onChange: setShowMemo,
      content: showMemo && <UseMemoDemo />,
    },
    {
      id: "callback",
      label: "Show useCallback demo",
      enabled: showCallback,
      onChange: setShowCallback,
      content: showCallback && <UseCallbackDemo />,
    },
    {
      id: "reducer",
      label: "Show useReducer demo",
      enabled: showReducer,
      onChange: setShowReducer,
      content: showReducer && <UseReducerDemo />,
    },
    {
      id: "transition",
      label: "Show useTransition demo",
      enabled: showTransition,
      onChange: setShowTransition,
      content: showTransition && <UseTransitionDemo />,
    },
    {
      id: "deferred",
      label: "Show useDeferredValue demo",
      enabled: showDeferred,
      onChange: setShowDeferred,
      content: showDeferred && <UseDeferredValueDemo />,
    },
    {
      id: "layout-effect",
      label: "Show useLayoutEffect demo",
      enabled: showLayoutEffect,
      onChange: setShowLayoutEffect,
      content: showLayoutEffect && <UseLayoutEffectDemo />,
    },
  ];

  return (
    <section className="hook-demos-section">
      <RenderDebugBadge name="HookDemosSection" count={count} />
      <h2 className="drill-title">More React hooks</h2>
      {demos.map((demo) => (
        <div key={demo.id} className="hook-demo-toggle-group">
          <label className="effect-demo-toggle">
            <input
              type="checkbox"
              checked={demo.enabled}
              onChange={(event) => demo.onChange(event.target.checked)}
            />
            {demo.label}
          </label>
          {demo.content}
        </div>
      ))}
    </section>
  );
}
