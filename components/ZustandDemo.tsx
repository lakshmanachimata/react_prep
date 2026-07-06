"use client";

import { memo, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import {
  useCounterStore,
  usePreferencesStore,
  useTodoStore,
} from "@/lib/zustand/demoStores";

function ZustandCounterToolbar() {
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  const { count: renders } = useRenderDebug("ZustandCounterToolbar");

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ZustandCounterToolbar" count={renders} />
      <h3>1. Basic store + selectors</h3>
      <p>
        <code>create()</code> — no Provider. Select individual fields so components
        only re-render when that field changes.
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={decrement}>
          -1
        </button>
        <button type="button" onClick={increment}>
          +1
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

function ZustandCountDisplay() {
  const count = useCounterStore((state) => state.count);
  const { count: renders } = useRenderDebug("ZustandCountDisplay", { count });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ZustandCountDisplay" count={renders} />
      <p>
        count: <strong>{count}</strong>
      </p>
    </div>
  );
}

function ZustandLabelDisplay() {
  const label = useCounterStore((state) => state.label);
  const { count: renders } = useRenderDebug("ZustandLabelDisplay", { label });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ZustandLabelDisplay" count={renders} />
      <p>
        static label: <strong>{label}</strong> (badge should stay at 1)
      </p>
    </div>
  );
}

function ZustandShallowPanel() {
  const { count, lastAction } = useCounterStore(
    useShallow((state) => ({ count: state.count, lastAction: state.lastAction })),
  );
  const { count: renders } = useRenderDebug("ZustandShallowPanel", {
    count,
    lastAction,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ZustandShallowPanel" count={renders} />
      <h3>2. useShallow</h3>
      <p>
        Pick multiple fields without re-rendering when unrelated store keys change.
      </p>
      <p>
        count: <strong>{count}</strong>, last: <strong>{lastAction}</strong>
      </p>
    </div>
  );
}

function ZustandPersistPanel() {
  const accent = usePreferencesStore((state) => state.accent);
  const setAccent = usePreferencesStore((state) => state.setAccent);
  const { count: renders } = useRenderDebug("ZustandPersistPanel", { accent });

  return (
    <div className={`state-demo-panel zustand-accent-${accent}`}>
      <RenderDebugBadge name="ZustandPersistPanel" count={renders} />
      <h3>3. Persist middleware</h3>
      <p>
        <code>persist</code> saves to <code>sessionStorage</code>. Refresh the page —
        accent should remain.
      </p>
      <p>
        accent: <strong>{accent}</strong>
      </p>
      <div className="effect-demo-controls">
        {(["blue", "green", "purple"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setAccent(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function ZustandTodoPanel() {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const clearDone = useTodoStore((state) => state.clearDone);
  const [text, setText] = useState("");
  const { count: renders } = useRenderDebug("ZustandTodoPanel", {
    todoCount: todos.length,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ZustandTodoPanel" count={renders} />
      <h3>4. Lists + actions with get()</h3>
      <p>Store actions use <code>get()</code> for immutable array updates.</p>
      <form
        className="prop-user-form"
        onSubmit={(event) => {
          event.preventDefault();
          addTodo(text);
          setText("");
        }}
      >
        <label>
          New todo
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a todo..."
          />
        </label>
        <button type="submit">Add</button>
      </form>
      <ul className="prop-user-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              {todo.done ? <s>{todo.text}</s> : todo.text}
            </label>
          </li>
        ))}
      </ul>
      {todos.some((todo) => todo.done) && (
        <button type="button" onClick={clearDone}>
          Clear done
        </button>
      )}
    </div>
  );
}

function ZustandExternalSubscribePanel() {
  const [externalCount, setExternalCount] = useState(
    () => useCounterStore.getState().count,
  );
  const { count: renders } = useRenderDebug("ZustandExternalSubscribePanel", {
    externalCount,
  });

  useEffect(() => {
    const unsubscribe = useCounterStore.subscribe((state) => {
      setExternalCount(state.count);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="ZustandExternalSubscribePanel" count={renders} />
      <h3>5. subscribe + getState (outside React)</h3>
      <p>
        This panel listens via <code>store.subscribe()</code>, not{" "}
        <code>useCounterStore()</code>. Useful for logging, analytics, or non-React
        code.
      </p>
      <p>
        mirrored count: <strong>{externalCount}</strong>
      </p>
      <button
        type="button"
        onClick={() => useCounterStore.getState().increment()}
      >
        Increment via getState()
      </button>
    </div>
  );
}

function ZustandDemo() {
  const { count: renders } = useRenderDebug("ZustandDemo");

  return (
    <section className="effect-demo state-demo zustand-demo">
      <RenderDebugBadge name="ZustandDemo" count={renders} />
      <h2>Zustand playground</h2>
      <p className="drill-description">
        Lightweight global state — no Provider, fine-grained selectors, middleware,
        and external subscriptions.
      </p>

      <div className="state-demo-panel">
        <h3>Zustand vs Redux (quick)</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>No boilerplate</strong> — one <code>create()</code> function vs
            slices + Provider
          </li>
          <li>
            <strong>Selectors built in</strong> — pass <code>(s) =&gt; s.count</code>{" "}
            to the hook
          </li>
          <li>
            <strong>Middleware</strong> — <code>persist</code>, devtools, immer
          </li>
          <li>
            <strong>Outside React</strong> — <code>getState()</code>,{" "}
            <code>setState</code>, <code>subscribe()</code>
          </li>
        </ul>
      </div>

      <ZustandCounterToolbar />
      <ZustandCountDisplay />
      <ZustandLabelDisplay />
      <ZustandShallowPanel />
      <ZustandPersistPanel />
      <ZustandTodoPanel />
      <ZustandExternalSubscribePanel />
    </section>
  );
}

export default memo(ZustandDemo);
