"use client";

import { memo, useCallback, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type CallbackChildProps = {
  label: string;
  onAction: () => void;
};

const MemoCallbackChild = memo(function MemoCallbackChild({
  label,
  onAction,
}: CallbackChildProps) {
  const { count: renders } = useRenderDebug(label);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name={label} count={renders} />
      <button type="button" onClick={onAction}>
        {label} action
      </button>
    </div>
  );
});

function UseCallbackDemo() {
  const [bump, setBump] = useState(0);
  const [score, setScore] = useState(0);
  const [toggleValue, setToggleValue] = useState(false);
  const [valueToAdd, setValueToAdd] = useState(2);
  const { count: renders } = useRenderDebug("UseCallbackDemo", { bump, score });

  const unstableAction = () => {setScore((value) => value + 1), []};
  const stableAction = useCallback(() => { 
    setValueToAdd(toggleValue ? 2 : 2)
    setToggleValue(!toggleValue);
    setScore((value) => value + valueToAdd); }, [valueToAdd]
  );

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseCallbackDemo" count={renders} />
      <h2>useCallback playground</h2>
      <p className="drill-description">
        <code>useCallback</code> keeps the same function reference between
        renders. Memoized children skip re-render when the callback prop is
        stable.
      </p>
      <p>
        score: <strong>{score}</strong>, parent bump: <strong>{bump}</strong>
      </p>
      <button type="button" onClick={() => setBump((value) => value + 1)}>
        Parent re-render
      </button>
      <MemoCallbackChild label="UnstableCallbackChild" onAction={unstableAction} />
      <MemoCallbackChild label="StableCallbackChild" onAction={stableAction} />
      <ul className="effect-demo-legend">
        <li>
          Unstable child re-renders on every parent bump (new function each
          time)
        </li>
        <li>Stable child only re-renders when its own action runs</li>
      </ul>
    </section>
  );
}

export default memo(UseCallbackDemo);
