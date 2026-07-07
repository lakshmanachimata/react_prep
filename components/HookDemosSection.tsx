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
const ReduxDemo = dynamic(() => import("@/components/ReduxDemo"), { ssr: false });
const ContextApiDemo = dynamic(() => import("@/components/ContextApiDemo"), {
  ssr: false,
});
const ContextAlternativesDemo = dynamic(
  () => import("@/components/ContextAlternativesDemo"),
  { ssr: false },
);
const ContextOverrideDemo = dynamic(
  () => import("@/components/ContextOverrideDemo"),
  { ssr: false },
);
const ZustandDemo = dynamic(() => import("@/components/ZustandDemo"), { ssr: false });
const PortalDemo = dynamic(() => import("@/components/PortalDemo"), { ssr: false });
const ReduxThunkDemo = dynamic(() => import("@/components/ReduxThunkDemo"), {
  ssr: false,
});
const TanStackQueryDemo = dynamic(() => import("@/components/TanStackQueryDemo"), {
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
const UseIdDemo = dynamic(() => import("@/components/UseIdDemo"), { ssr: false });
const ForwardRefDemo = dynamic(() => import("@/components/ForwardRefDemo"), {
  ssr: false,
});
const ErrorBoundaryDemo = dynamic(() => import("@/components/ErrorBoundaryDemo"), {
  ssr: false,
});
const SuspenseLazyDemo = dynamic(() => import("@/components/SuspenseLazyDemo"), {
  ssr: false,
});
const KeysReconciliationDemo = dynamic(
  () => import("@/components/KeysReconciliationDemo"),
  { ssr: false },
);
const UseOptimisticDemo = dynamic(() => import("@/components/UseOptimisticDemo"), {
  ssr: false,
});
const UseActionStateDemo = dynamic(
  () => import("@/components/UseActionStateDemo"),
  { ssr: false },
);
const ControlledVsUncontrolledDemo = dynamic(
  () => import("@/components/ControlledVsUncontrolledDemo"),
  { ssr: false },
);
const VirtualListDemo = dynamic(() => import("@/components/VirtualListDemo"), {
  ssr: false,
});

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
  const [showRedux, setShowRedux] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [showContextAlternatives, setShowContextAlternatives] = useState(false);
  const [showContextOverride, setShowContextOverride] = useState(false);
  const [showZustand, setShowZustand] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showReduxThunk, setShowReduxThunk] = useState(false);
  const [showTanStackQuery, setShowTanStackQuery] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showDeferred, setShowDeferred] = useState(false);
  const [showLayoutEffect, setShowLayoutEffect] = useState(false);
  const [showUseId, setShowUseId] = useState(false);
  const [showForwardRef, setShowForwardRef] = useState(false);
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);
  const [showSuspenseLazy, setShowSuspenseLazy] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [showOptimistic, setShowOptimistic] = useState(false);
  const [showActionState, setShowActionState] = useState(false);
  const [showControlled, setShowControlled] = useState(false);
  const [showVirtualList, setShowVirtualList] = useState(false);
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
      id: "redux",
      label: "Show Redux demo",
      enabled: showRedux,
      onChange: setShowRedux,
      content: showRedux && <ReduxDemo />,
    },
    {
      id: "context",
      label: "Show Context API demo",
      enabled: showContext,
      onChange: setShowContext,
      content: showContext && <ContextApiDemo />,
    },
    {
      id: "context-alternatives",
      label: "Show context alternatives demo",
      enabled: showContextAlternatives,
      onChange: setShowContextAlternatives,
      content: showContextAlternatives && <ContextAlternativesDemo />,
    },
    {
      id: "context-override",
      label: "Show context override demo",
      enabled: showContextOverride,
      onChange: setShowContextOverride,
      content: showContextOverride && <ContextOverrideDemo />,
    },
    {
      id: "zustand",
      label: "Show Zustand demo",
      enabled: showZustand,
      onChange: setShowZustand,
      content: showZustand && <ZustandDemo />,
    },
    {
      id: "portal",
      label: "Show React Portal demo",
      enabled: showPortal,
      onChange: setShowPortal,
      content: showPortal && <PortalDemo />,
    },
    {
      id: "redux-thunk",
      label: "Show Redux Thunk demo",
      enabled: showReduxThunk,
      onChange: setShowReduxThunk,
      content: showReduxThunk && <ReduxThunkDemo />,
    },
    {
      id: "tanstack-query",
      label: "Show TanStack Query demo",
      enabled: showTanStackQuery,
      onChange: setShowTanStackQuery,
      content: showTanStackQuery && <TanStackQueryDemo />,
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
    {
      id: "use-id",
      label: "Show useId demo",
      enabled: showUseId,
      onChange: setShowUseId,
      content: showUseId && <UseIdDemo />,
    },
    {
      id: "forward-ref",
      label: "Show forwardRef demo",
      enabled: showForwardRef,
      onChange: setShowForwardRef,
      content: showForwardRef && <ForwardRefDemo />,
    },
    {
      id: "error-boundary",
      label: "Show error boundary demo",
      enabled: showErrorBoundary,
      onChange: setShowErrorBoundary,
      content: showErrorBoundary && <ErrorBoundaryDemo />,
    },
    {
      id: "suspense-lazy",
      label: "Show Suspense + lazy demo",
      enabled: showSuspenseLazy,
      onChange: setShowSuspenseLazy,
      content: showSuspenseLazy && <SuspenseLazyDemo />,
    },
    {
      id: "keys",
      label: "Show keys & reconciliation demo",
      enabled: showKeys,
      onChange: setShowKeys,
      content: showKeys && <KeysReconciliationDemo />,
    },
    {
      id: "optimistic",
      label: "Show useOptimistic demo (React 19)",
      enabled: showOptimistic,
      onChange: setShowOptimistic,
      content: showOptimistic && <UseOptimisticDemo />,
    },
    {
      id: "action-state",
      label: "Show useActionState demo (React 19)",
      enabled: showActionState,
      onChange: setShowActionState,
      content: showActionState && <UseActionStateDemo />,
    },
    {
      id: "controlled",
      label: "Show controlled vs uncontrolled demo",
      enabled: showControlled,
      onChange: setShowControlled,
      content: showControlled && <ControlledVsUncontrolledDemo />,
    },
    {
      id: "virtual-list",
      label: "Show list virtualization demo (react-virtuoso)",
      enabled: showVirtualList,
      onChange: setShowVirtualList,
      content: showVirtualList && <VirtualListDemo />,
    },
  ];

  return (
    <section className="hook-demos-section">
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
