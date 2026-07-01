"use client";

import { memo, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { UserProvider, useUser } from "@/components/context/userContext";
import type { UserData } from "@/components/context/userTypes";
import { defaultUser } from "@/components/context/userTypes";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const overrideUser: UserData = {
  name: "Jordan",
  age: 35,
  gender: "Female",
};

function UserSummary({ title }: { title: string }) {
  const { name, age, gender } = useUser();
  const { count } = useRenderDebug(`UserSummary:${title}`, { name, age, gender });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name={`UserSummary:${title}`} count={count} />
      <h3>{title}</h3>
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

function ScopedUserForm({ label }: { label: string }) {
  const { name, age, gender, setName, setAge, setGender } = useUser();
  const { count } = useRenderDebug(`ScopedUserForm:${label}`, { name, age, gender });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name={`ScopedUserForm:${label}`} count={count} />
      <h3>{label}</h3>
      <p className="state-demo-note">
        Edits only the nearest <code>UserProvider</code> /{" "}
        <code>&lt;UserContext value=...&gt;</code> above this form.
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
    </div>
  );
}

function ContextOverrideTree({ showOverride }: { showOverride: boolean }) {
  const { count } = useRenderDebug("ContextOverrideTree", { showOverride });

  return (
    <>
      <RenderDebugBadge name="ContextOverrideTree" count={count} />
      <ScopedUserForm label="Root scope form" />
      <UserSummary title="Root branch reader" />

      {showOverride ? (
        // Nested provider overrides context for this subtree only.
        <UserProvider initialUser={overrideUser}>
          <div className="context-override-scope">
            <p className="state-demo-note">
              Inner <code>UserProvider</code> — descendants see Jordan until you
              edit this scope.
            </p>
            <ScopedUserForm label="Override scope form" />
            <UserSummary title="Override branch reader" />
          </div>
        </UserProvider>
      ) : (
        <p className="state-demo-note">Override scope is hidden — only root context is active.</p>
      )}

      <UserSummary title="Sibling after override (root again)" />
    </>
  );
}

function ContextOverrideDemo() {
  const [showOverride, setShowOverride] = useState(true);
  const { count } = useRenderDebug("ContextOverrideDemo", { showOverride });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="ContextOverrideDemo" count={count} />
      <h2>Context override playground</h2>
      <p className="drill-description">
        Nest a second <code>UserProvider</code> (React 19:{" "}
        <code>&lt;UserContext value=...&gt;</code>) to replace the value for one
        subtree. Descendants use the <strong>nearest</strong> context above them.
      </p>

      <div className="state-demo-panel">
        <h3>How override works</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>Nearest wins</strong> — <code>useUser()</code> reads the
            closest <code>UserContext</code> up the tree, not the root.
          </li>
          <li>
            <strong>Scoped state</strong> — each provider owns its own{" "}
            <code>useState</code>; editing the inner form does not change the root
            user.
          </li>
          <li>
            <strong>Siblings stay on root</strong> — components outside the inner
            provider still see the outer value.
          </li>
          <li>
            <strong>Common uses</strong> — themed section, modal with temporary
            locale, preview card with sample data.
          </li>
        </ul>
      </div>

      <label className="effect-demo-toggle">
        <input
          type="checkbox"
          checked={showOverride}
          onChange={(event) => setShowOverride(event.target.checked)}
        />
        Show nested override scope
      </label>

      {/* Outer scope starts from defaultUser (Alex) */}
      <UserProvider initialUser={defaultUser}>
        <ContextOverrideTree showOverride={showOverride} />
      </UserProvider>
    </section>
  );
}

export default memo(ContextOverrideDemo);
