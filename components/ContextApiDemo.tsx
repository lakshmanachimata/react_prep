"use client";

import { memo } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { UserProvider, useUser } from "@/components/context/userContext";
import { useRenderDebug } from "@/hooks/useRenderDebug";

function ContextUserForm() {
  // Consumer of UserContext — re-renders whenever context `value` changes.
  const { name, age, gender, setName, setAge, setGender } = useUser();
  const { count } = useRenderDebug("ContextUserForm", { name, age, gender });

  return (
    <>
      <RenderDebugBadge name="ContextUserForm" count={count} />
      <form
        className="prop-user-form"
        onSubmit={(event) => event.preventDefault()}
      >
        {/* setters come from context instead of props drilled from PropRoot */}
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Age
          <input
            type="number"
            min={1}
            value={age}
            onChange={(event) => setAge(Number(event.target.value) || 0)}
          />
        </label>
        <label>
          Gender
          <input
            type="text"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          />
        </label>
      </form>
    </>
  );
}

// Middle layer: no user props in the API — compare to prop-drilling Child.
function ContextChild() {
  // Does not call useUser(), but still re-renders when ContextApiDemoTree re-renders.
  const { count } = useRenderDebug("ContextChild");

  return (
    <div className="prop-child">
      <RenderDebugBadge name="ContextChild" count={count} />
      <p className="drill-pass-through">
        No name/age/gender props — still re-renders when parent/context updates.
      </p>
      <ContextGrandChild />
    </div>
  );
}

function ContextGrandChild() {
  // Subscribes to context — re-renders when any field in context `value` changes.
  const { name, age, gender } = useUser();
  const { count } = useRenderDebug("ContextGrandChild", { name, age, gender });

  return (
    <div className="prop-grandchild">
      <RenderDebugBadge name="ContextGrandChild" count={count} />
      <h3>User profile</h3>
      <p className="state-demo-note">
        Reads user via <code>useUser()</code> instead of props.
      </p>
      <ul className="prop-user-list">
        <li>
          <strong>Name:</strong> {name}
        </li>
        <li>
          <strong>Age:</strong> {age}
        </li>
        <li>
          <strong>Gender:</strong> {gender}
        </li>
      </ul>
    </div>
  );
}

function ContextApiDemoTree() {
  // Renders inside <UserProvider> — descendants can call useUser().
  const { count } = useRenderDebug("ContextApiDemoTree");
  return (
    <>
      <RenderDebugBadge name="ContextApiDemoTree" count={count} />
      <ContextUserForm />
      <ContextChild />
    </>
  );
}

function ContextApiDemo() {
  const { count } = useRenderDebug("ContextApiDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="ContextApiDemo" count={count} />
      <h2>Context API playground</h2>
      <p className="drill-description">
        <code>createContext</code> + <code>&lt;UserContext value=...&gt;</code> share
        state with deep components via <code>useContext</code> (here wrapped as{" "}
        <code>useUser</code>) — no prop drilling through the middle layer.
      </p>

      <div className="state-demo-panel">
        <h3>Context API advantages</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>Removes prop drilling</strong> — middle components do not need
            user fields in their props.
          </li>
          <li>
            <strong>Built into React</strong> — no extra library for local/shared
            tree state.
          </li>
          <li>
            <strong>Good for theme, locale, auth session</strong> — data many
            branches need.
          </li>
        </ul>
        <h3>Context caveats</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>All consumers re-render</strong> when the context{" "}
            <code>value</code> changes (one big context object here).
          </li>
          <li>
            <strong>Middle layers still re-render</strong> when an ancestor
            re-renders — context does not skip that by itself.
          </li>
          <li>
            <strong>Harder to trace</strong> than explicit props — see the
            alternatives demo for split context.
          </li>
        </ul>
      </div>

      {/* UserProvider renders <UserContext value={...}> — see userContext.tsx */}
      <UserProvider>
        <ContextApiDemoTree />
      </UserProvider>
    </section>
  );
}

// Skips re-rendering this shell when HookDemosSection re-renders with the same props (none here).
export default memo(ContextApiDemo);
