import usersReducer, {
  addUser,
  clearUsersError,
  loadUsers,
} from "@/lib/redux/usersSlice";
import { createThunkDemoStore } from "@/lib/redux/thunkStore";

jest.mock("@/lib/mock/demoApi", () => ({
  fetchUsers: jest.fn(),
  createUser: jest.fn(),
}));

import { createUser, fetchUsers } from "@/lib/mock/demoApi";

const mockedFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>;
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;

describe("usersSlice reducer", () => {
  const initial = usersReducer(undefined, { type: "@@INIT" });

  it("has empty initial items", () => {
    expect(initial.items).toEqual([]);
    expect(initial.status).toBe("idle");
  });

  it("clearUsersError clears error fields", () => {
    const errored = {
      ...initial,
      error: "oops",
      createError: "bad",
    };
    const next = usersReducer(errored, clearUsersError());
    expect(next.error).toBeNull();
    expect(next.createError).toBeNull();
  });

  it("loadUsers.rejected uses rejectWithValue payload", () => {
    const next = usersReducer(
      initial,
      loadUsers.rejected(new Error("ignored"), "req-1", {}, "payload error"),
    );
    expect(next.status).toBe("failed");
    expect(next.error).toBe("payload error");
    expect(next.lastAction).toBe("loadUsers:rejected");
  });

  it("loadUsers.rejected falls back to error.message", () => {
    const next = usersReducer(
      initial,
      loadUsers.rejected(new Error("network fail"), "req-1", {}, undefined),
    );
    expect(next.error).toBe("network fail");
  });

  it("loadUsers.rejected falls back to generic Error string", () => {
    const next = usersReducer(
      initial,
      loadUsers.rejected({ name: "SerializedError" }, "req-1", {}, undefined),
    );
    expect(next.error).toBe("Error");
  });

  it("loadUsers.pending sets loading state", () => {
    const next = usersReducer(initial, loadUsers.pending("req-1", {}));
    expect(next.status).toBe("loading");
    expect(next.error).toBeNull();
    expect(next.lastAction).toBe("loadUsers:pending");
  });

  it("addUser.pending sets create loading state", () => {
    const next = usersReducer(
      initial,
      addUser.pending("req-2", { name: "A", role: "B" }),
    );
    expect(next.createStatus).toBe("loading");
    expect(next.createError).toBeNull();
    expect(next.lastAction).toBe("addUser:pending");
  });

  it("addUser.rejected uses rejectWithValue payload", () => {
    const next = usersReducer(
      initial,
      addUser.rejected(new Error("ignored"), "req-3", { name: "A", role: "B" }, "create failed"),
    );
    expect(next.createStatus).toBe("failed");
    expect(next.createError).toBe("create failed");
    expect(next.lastAction).toBe("addUser:rejected");
  });

  it("addUser.rejected falls back to error.message", () => {
    const next = usersReducer(
      initial,
      addUser.rejected(new Error("bad create"), "req-4", { name: "A", role: "B" }, undefined),
    );
    expect(next.createError).toBe("bad create");
  });

  it("addUser.rejected falls back to generic Error string", () => {
    const next = usersReducer(
      initial,
      addUser.rejected({ name: "SerializedError" }, "req-5", { name: "A", role: "B" }, undefined),
    );
    expect(next.createError).toBe("Error");
  });
});

describe("users async thunks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loadUsers fulfilled stores users", async () => {
    mockedFetchUsers.mockResolvedValue([
      { id: 1, name: "Alex", role: "Admin" },
    ]);
    const store = createThunkDemoStore();
    await store.dispatch(loadUsers({}));

    expect(store.getState().users.status).toBe("succeeded");
    expect(store.getState().users.items).toHaveLength(1);
    expect(store.getState().users.lastAction).toBe("loadUsers:fulfilled");
  });

  it("loadUsers uses default options when dispatched with no arg", async () => {
    mockedFetchUsers.mockResolvedValue([{ id: 2, name: "Sam", role: "Editor" }]);
    const store = createThunkDemoStore();
    // Exercises default `options = {}` parameter in the thunk payload creator.
    await store.dispatch(loadUsers() as ReturnType<typeof loadUsers>);
    expect(mockedFetchUsers).toHaveBeenCalledWith({});
  });

  it("loadUsers rejected stores Error message", async () => {
    mockedFetchUsers.mockRejectedValue(new Error("Mock server error"));
    const store = createThunkDemoStore();
    await store.dispatch(loadUsers({ fail: true }));

    expect(store.getState().users.status).toBe("failed");
    expect(store.getState().users.error).toBe("Mock server error");
  });

  it("loadUsers rejected uses fallback for non-Error throws", async () => {
    mockedFetchUsers.mockRejectedValue("not an Error");
    const store = createThunkDemoStore();
    await store.dispatch(loadUsers({}));

    expect(store.getState().users.status).toBe("failed");
    expect(store.getState().users.error).toBe("Failed to load users");
  });

  it("addUser fulfilled appends user", async () => {
    mockedCreateUser.mockResolvedValue({
      id: 99,
      name: "New",
      role: "Viewer",
    });
    const store = createThunkDemoStore();
    await store.dispatch(addUser({ name: "New", role: "Viewer" }));

    expect(store.getState().users.items).toEqual([
      { id: 99, name: "New", role: "Viewer" },
    ]);
    expect(store.getState().users.createStatus).toBe("idle");
    expect(store.getState().users.lastAction).toBe("addUser:fulfilled");
  });

  it("addUser rejected stores Error message", async () => {
    mockedCreateUser.mockRejectedValue(new Error("Create failed"));
    const store = createThunkDemoStore();
    await store.dispatch(addUser({ name: "X", role: "Y" }));

    expect(store.getState().users.createStatus).toBe("failed");
    expect(store.getState().users.createError).toBe("Create failed");
  });

  it("addUser rejected uses fallback for non-Error throws", async () => {
    mockedCreateUser.mockRejectedValue("not an Error");
    const store = createThunkDemoStore();
    await store.dispatch(addUser({ name: "X", role: "Y" }));

    expect(store.getState().users.createStatus).toBe("failed");
    expect(store.getState().users.createError).toBe("Failed to create user");
  });
});
