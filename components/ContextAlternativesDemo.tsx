"use client";

import { memo, useState, type ReactNode } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import {
  SplitUserProvider,
  useUserDispatch,
  useUserState,
} from "@/components/context/splitUserContext";
import type { UserData } from "@/components/context/userTypes";
import { defaultUser } from "@/components/context/userTypes";
import { useRenderDebug } from "@/hooks/useRenderDebug";

// --- Alternative 1: component composition (children slot) ---

function CompositionProfile({ name, age, gender }: UserData) {
  // Leaf receives explicit props — easy to trace, unlike context.
  const { count } = useRenderDebug("CompositionProfile", { name, age, gender });

  return (
    <div className="prop-grandchild">
      <RenderDebugBadge name="CompositionProfile" count={count} />
      <h3>User profile</h3>
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

// Shell only accepts `children` — no user props in its API.
function CompositionShell({ children }: { children: ReactNode }) {
  // Layout wrapper: renders slot content without knowing user field names.
  const { count } = useRenderDebug("CompositionShell");

  return (
    <div className="prop-child">
      <RenderDebugBadge name="CompositionShell" count={count} />
      <p className="drill-pass-through">
        Shell renders <code>children</code> — does not know about user fields.
      </p>
      {children}
    </div>
  );
}

function CompositionPanel() {
  // State stays in the parent closest to where it is edited and displayed.
  const [name, setName] = useState(defaultUser.name);
  const [age, setAge] = useState(defaultUser.age);
  const [gender, setGender] = useState(defaultUser.gender);
  const { count } = useRenderDebug("CompositionPanel", { name, age, gender });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="CompositionPanel" count={count} />
      <h3>1. Component composition</h3>
      <p className="state-demo-note">
        Parent owns state and passes JSX as <code>children</code>. Middle shell
        stays decoupled from user shape — no forwarding props.
      </p>
      <form
        className="prop-user-form"
        onSubmit={(event) => event.preventDefault()}
      >
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
      {/* Profile is created here — shell only renders the children slot */}
      <CompositionShell>
        <CompositionProfile name={name} age={age} gender={gender} />
      </CompositionShell>
    </div>
  );
}

// --- Alternative 2: split context (state vs dispatch) ---

function SplitUserForm() {
  const { setName, setAge, setGender } = useUserDispatch();
  const { name, age, gender } = useUserState();
  const { count } = useRenderDebug("SplitUserForm", { name, age, gender });

  return (
    <>
      <RenderDebugBadge name="SplitUserForm" count={count} />
      <p className="state-demo-note">
        Controlled form needs state values, so it re-renders on edits. Compare with
        the dispatch-only panel below.
      </p>
      <form
        className="prop-user-form"
        onSubmit={(event) => event.preventDefault()}
      >
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

// Subscribes only to dispatch context — render count should stay flat while typing.
function SplitDispatchOnlyPanel() {
  // useUserDispatch() only — not subscribed to UserStateContext, so typing in the form
  // above should not bump this render badge (dispatch object is stable).
  const { setAge } = useUserDispatch();
  const { count } = useRenderDebug("SplitDispatchOnlyPanel");

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="SplitDispatchOnlyPanel" count={count} />
      <p className="state-demo-note">
        Only <code>useUserDispatch()</code> — no state subscription. Typing in the
        form above should not bump this badge.
      </p>
      <button type="button" onClick={() => setAge(99)}>
        Set age to 99 (dispatch only)
      </button>
    </div>
  );
}

function SplitContextBridge() {
  // Pass-through layer — no context hooks, same idea as ContextChild in the API demo.
  const { count } = useRenderDebug("SplitContextBridge");

  return (
    <div className="prop-child">
      <RenderDebugBadge name="SplitContextBridge" count={count} />
      <p className="drill-pass-through">No props — profile reads split context below.</p>
      <SplitContextProfile />
    </div>
  );
}

function SplitContextProfile() {
  // Subscribes only to state context — re-renders when user data changes.
  const { name, age, gender } = useUserState();
  const { count } = useRenderDebug("SplitContextProfile", { name, age, gender });

  return (
    <div className="prop-grandchild">
      <RenderDebugBadge name="SplitContextProfile" count={count} />
      <h3>User profile</h3>
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

function SplitContextPanel() {
  const { count } = useRenderDebug("SplitContextPanel");

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="SplitContextPanel" count={count} />
      <h3>2. Split context (state + dispatch)</h3>
      <p className="state-demo-note">
        Separate <code>UserStateContext</code> and{" "}
        <code>UserDispatchContext</code>. Dispatch value is stable, so components
        that only call setters avoid extra re-renders from unrelated state reads.
      </p>
      {/* Two providers: stable dispatch outside, changing user state inside — see splitUserContext.tsx */}
      <SplitUserProvider>
        <SplitUserForm />
        <SplitDispatchOnlyPanel />
        <SplitContextBridge />
      </SplitUserProvider>
    </div>
  );
}

function ContextAlternativesDemo() {
  const { count } = useRenderDebug("ContextAlternativesDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="ContextAlternativesDemo" count={count} />
      <h2>Context alternatives</h2>
      <p className="drill-description">
        Other ways to avoid prop drilling or reduce context re-render cost. Pick
        based on how wide and how often state changes.
      </p>

      <div className="state-demo-panel">
        <h3>When to use what</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>Composition</strong> — best for one branch; parent passes
            ready-made JSX as <code>children</code>. Simple, explicit, no magic.
          </li>
          <li>
            <strong>Context API</strong> — many distant consumers need the same
            data (theme, user session). Watch the single-value re-render issue.
          </li>
          <li>
            <strong>Split context</strong> — same as context, but separate state
            and dispatch (or theme vs actions) to limit re-renders.
          </li>
          <li>
            <strong>useReducer + Context</strong> — complex updates in one
            reducer; dispatch reference can stay stable.
          </li>
          <li>
            <strong>Redux / Zustand / Jotai</strong> — app-wide state, DevTools,
            middleware, selectors — when context trees get hard to maintain.
          </li>
        </ul>
      </div>

      <CompositionPanel />
      <SplitContextPanel />
    </section>
  );
}

// Skips re-rendering this shell when HookDemosSection re-renders with the same props (none here).
export default memo(ContextAlternativesDemo);
