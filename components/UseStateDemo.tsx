"use client";

import { memo, useRef, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { debugLog } from "@/lib/debugLog";

function BasicUpdatePanel() {
  const [count, setCount] = useState(0);
  const { count: renders } = useRenderDebug("BasicUpdatePanel", { count });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="BasicUpdatePanel" count={renders} />
      <h3>1. Basic update</h3>
      <p>
        <code>setCount(count + 1)</code> — count: <strong>{count}</strong>
      </p>
      <button type="button" onClick={() => setCount(count + 1)}>
        +1 direct
      </button>
    </div>
  );
}

function StaleVsFunctionalPanel() {
  const [count, setCount] = useState(0);
  const { count: renders } = useRenderDebug("StaleVsFunctionalPanel", { count });

  function doubleIncrementStale() {
    debugLog("[stale] before updates, count =", count);
    setCount(count + 1);
    setCount(count + 1);
    debugLog("[stale] queued two updates from the same count value");
  }

  function doubleIncrementFunctional() {
    setCount((value) => value + 1);
    setCount((value) => value + 1);
    debugLog("[functional] queued two updates from previous state");
  }

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="StaleVsFunctionalPanel" count={renders} />
      <h3>2. Stale vs functional update</h3>
      <p>
        count: <strong>{count}</strong> — two updates in one click.
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={doubleIncrementStale}>
          +2 attempt (stale) → usually +1
        </button>
        <button type="button" onClick={doubleIncrementFunctional}>
          +2 (functional) → +2
        </button>
      </div>
    </div>
  );
}

function BatchPanel() {
  const [batchA, setBatchA] = useState(0);
  const [batchB, setBatchB] = useState(0);
  const { count: renders } = useRenderDebug("BatchPanel", { batchA, batchB });

  function batchUpdate() {
    debugLog("[batch] setting batchA and batchB in one click");
    setBatchA((value) => value + 1);
    setBatchB((value) => value + 10);
  }

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="BatchPanel" count={renders} />
      <h3>3. Batching</h3>
      <p>
        Two setters in one event. React batches them into{" "}
        <strong>one re-render</strong>.
      </p>
      <p>
        batchA: <strong>{batchA}</strong>, batchB: <strong>{batchB}</strong>
      </p>
      <button type="button" onClick={batchUpdate}>
        Batch update (+1 and +10)
      </button>
    </div>
  );
}

function ObjectStatePanel() {
  const [user, setUser] = useState({ name: "Alex", age: 28 });
  const { count: renders } = useRenderDebug("ObjectStatePanel", {
    name: user.name,
    age: user.age,
  });

  function mutateInPlace() {
    user.age += 1;
    setUser(user);
    debugLog("[ObjectStatePanel] mutated in place — same object reference", user);
  }

  function birthdayImmutable() {
    setUser({ ...user, age: user.age + 1 });
    debugLog("[ObjectStatePanel] new object via spread — triggers re-render");
  }

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ObjectStatePanel" count={renders} />
      <h3>4. Object state (immutable update)</h3>
      <p>
        <strong>Birthday</strong> creates a new object → re-render happens and
        the UI updates. <strong>Mutate in place</strong> changes{" "}
        <code>user.age</code> but passes the same reference → React skips the
        update (no re-render, age on screen stays the same).
      </p>
      <p>
        {user.name}, age {user.age}
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={birthdayImmutable}>
          Birthday (+1 age, immutable)
        </button>
        <button type="button" onClick={mutateInPlace}>
          Mutate in place (no re-render)
        </button>
      </div>
    </div>
  );
}

function ArrayStatePanel() {
  const [tags, setTags] = useState(["react", "hooks"]);
  const { count: renders } = useRenderDebug("ArrayStatePanel", { tags });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ArrayStatePanel" count={renders} />
      <h3>5. Array state (immutable update)</h3>
      <p>
        <code>{tags.join(", ")}</code>
      </p>
      <div className="effect-demo-controls">
        <button
          type="button"
          onClick={() => setTags([...tags, `tag-${tags.length + 1}`])}
        >
          Add tag
        </button>
        <button
          type="button"
          onClick={() => setTags(tags.slice(0, -1))}
          disabled={tags.length === 0}
        >
          Remove last
        </button>
      </div>
    </div>
  );
}

function LazyInitPanel() {
  const lazyInitLogged = useRef(false);
  const [lazyValue] = useState(() => {
    if (!lazyInitLogged.current) {
      lazyInitLogged.current = true;
      debugLog("[useState] lazy initializer ran");
    }
    return 100;
  });
  const [lazyInitCount] = useState(() => {
    const globalScope = globalThis as typeof globalThis & {
      __useStateDemoLazyCount?: number;
    };
    globalScope.__useStateDemoLazyCount =
      (globalScope.__useStateDemoLazyCount ?? 0) + 1;
    return globalScope.__useStateDemoLazyCount;
  });
  const { count: renders } = useRenderDebug("LazyInitPanel", {
    lazyValue,
    lazyInitCount,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="LazyInitPanel" count={renders} />
      <h3>6. Lazy initial state</h3>
      <p>
        <code>useState(() =&gt; value)</code> runs the function only on the
        first render. Value: <strong>{lazyValue}</strong>
      </p>
      <p className="state-demo-note">
        Lazy initializer calls for this mount: <strong>{lazyInitCount}</strong>
      </p>
    </div>
  );
}

function RefVsStatePanel() {
  const [stateClicks, setStateClicks] = useState(0);
  const refClicks = useRef(0);
  const [refDisplay, setRefDisplay] = useState(0);
  const { count: renders } = useRenderDebug("RefVsStatePanel", {
    stateClicks,
    refDisplay,
  });

  function incrementRefOnly() {
    refClicks.current += 1;
    debugLog("[useRef] refClicks =", refClicks.current, "(no re-render)");
  }

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="RefVsStatePanel" count={renders} />
      <h3>7. useState vs useRef</h3>
      <p>State updates re-render. Ref updates do not.</p>
      <p>
        stateClicks: <strong>{stateClicks}</strong>, refClicks:{" "}
        <strong>{refDisplay}</strong> (display refreshed manually)
      </p>
      <div className="effect-demo-controls">
        <button
          type="button"
          onClick={() => setStateClicks((value) => value + 1)}
        >
          State +1 (re-renders)
        </button>
        <button type="button" onClick={incrementRefOnly}>
          Ref +1 (no re-render)
        </button>
        <button type="button" onClick={() => setRefDisplay(refClicks.current)}>
          Show ref value
        </button>
      </div>
    </div>
  );
}

function UseStateDemo() {
  const { count: renders } = useRenderDebug("UseStateDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseStateDemo" count={renders} />
      <h2>useState playground</h2>
      <p className="drill-description">
        Each panel is its own component with its own state. Click a button and
        watch which render counts increase — only the panel you interact with
        should re-render.
      </p>

      <BasicUpdatePanel />
      <StaleVsFunctionalPanel />
      <BatchPanel />
      <ObjectStatePanel />
      <ArrayStatePanel />
      <LazyInitPanel />
      <RefVsStatePanel />

      <ul className="effect-demo-legend">
        <li>
          <code>useState</code> — value changes schedule a re-render
        </li>
        <li>
          <code>setState(fn)</code> — safest when next value depends on previous
        </li>
        <li>
          Multiple setters in one event — batched into one render
        </li>
        <li>
          Objects/arrays — replace with a new reference, do not mutate
        </li>
        <li>
          <code>useState(() =&gt; ...)</code> — lazy init runs once per mount
        </li>
        <li>
          <code>useRef</code> — related hook for values that should not re-render
        </li>
      </ul>
    </section>
  );
}

export default memo(UseStateDemo);
