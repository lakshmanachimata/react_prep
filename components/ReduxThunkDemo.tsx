"use client";

import { memo, useMemo, useState } from "react";
import { Provider } from "react-redux";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { useThunkDispatch, useThunkSelector } from "@/lib/redux/thunkHooks";
import { createThunkDemoStore } from "@/lib/redux/thunkStore";
import { addUser, clearUsersError, loadUsers } from "@/lib/redux/usersSlice";

function UsersListPanel() {
  const dispatch = useThunkDispatch();
  const { items, status, error, lastAction } = useThunkSelector((state) => state.users);
  const { count: renders } = useRenderDebug("UsersListPanel", {
    status,
    count: items.length,
    lastAction,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="UsersListPanel" count={renders} />
      <h3>1. createAsyncThunk — load users</h3>
      <p>
        <code>dispatch(loadUsers())</code> runs the thunk → pending → fulfilled /
        rejected updates slice via <code>extraReducers</code>.
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={() => dispatch(loadUsers({}))}>
          Load users
        </button>
        <button type="button" onClick={() => dispatch(loadUsers({ fail: true }))}>
          Simulate error
        </button>
        <button type="button" onClick={() => dispatch(clearUsersError())}>
          Clear errors
        </button>
      </div>
      <p>
        status: <strong>{status}</strong>, last action: <strong>{lastAction}</strong>
      </p>
      {status === "loading" && <p className="state-demo-note">Loading mock users...</p>}
      {error && <p className="drill-pass-through">Error: {error}</p>}
      <ul className="prop-user-list">
        {items.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.role}
          </li>
        ))}
      </ul>
      {status === "succeeded" && items.length === 0 && (
        <p className="state-demo-note">No users loaded yet.</p>
      )}
    </div>
  );
}

function AddUserPanel() {
  const dispatch = useThunkDispatch();
  const { createStatus, createError } = useThunkSelector((state) => state.users);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Viewer");
  const { count: renders } = useRenderDebug("AddUserPanel", { createStatus, name, role });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="AddUserPanel" count={renders} />
      <h3>2. createAsyncThunk — create user</h3>
      <p>Second thunk appends the returned user to <code>state.users.items</code>.</p>
      <form
        className="prop-user-form"
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(addUser({ name, role }));
          setName("");
        }}
      >
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New user"
          />
        </label>
        <label>
          Role
          <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </label>
        <button type="submit" disabled={createStatus === "loading"}>
          {createStatus === "loading" ? "Creating..." : "Add user (async)"}
        </button>
      </form>
      {createError && <p className="drill-pass-through">Create error: {createError}</p>}
    </div>
  );
}

function ReduxThunkDemoTree() {
  const { count: renders } = useRenderDebug("ReduxThunkDemoTree");

  return (
    <>
      <RenderDebugBadge name="ReduxThunkDemoTree" count={renders} />
      <UsersListPanel />
      <AddUserPanel />
    </>
  );
}

function ReduxThunkDemo() {
  const store = useMemo(() => createThunkDemoStore(), []);
  const { count: renders } = useRenderDebug("ReduxThunkDemo");

  return (
    <section className="effect-demo state-demo redux-demo">
      <RenderDebugBadge name="ReduxThunkDemo" count={renders} />
      <h2>Redux Thunk playground</h2>
      <p className="drill-description">
        RTK&apos;s <code>createAsyncThunk</code> is the modern thunk API. It dispatches
        pending / fulfilled / rejected actions automatically so reducers stay pure.
      </p>

      <div className="state-demo-panel">
        <h3>Thunk flow</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>dispatch(loadUsers())</strong> → runs async mock API
          </li>
          <li>
            <strong>pending</strong> → <code>status: &quot;loading&quot;</code>
          </li>
          <li>
            <strong>fulfilled</strong> → <code>items</code> updated with payload
          </li>
          <li>
            <strong>rejected</strong> → <code>error</code> set via{" "}
            <code>rejectWithValue</code>
          </li>
        </ul>
        <p className="state-demo-note">
          Redux Toolkit includes thunk middleware by default — no manual{" "}
          <code>redux-thunk</code> setup needed.
        </p>
      </div>

      <Provider store={store}>
        <ReduxThunkDemoTree />
      </Provider>
    </section>
  );
}

export default memo(ReduxThunkDemo);
