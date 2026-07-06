// Slice for ReduxThunkDemo only — async load/create users with createAsyncThunk.
// Lives separately from counterSlice so the thunk demo has its own isolated store.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUser, fetchUsers, type User } from "@/lib/mock/demoApi";

export type UsersState = {
  items: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  createStatus: "idle" | "loading" | "failed";
  createError: string | null;
  lastAction: string;
};

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  lastAction: "none",
};

// Thunk #1: fetch list — pending/fulfilled/rejected wired in extraReducers below.
export const loadUsers = createAsyncThunk(
  "users/loadUsers",
  async (options: { fail?: boolean } = {}, { rejectWithValue }) => {
    try {
      return await fetchUsers(options);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load users",
      );
    }
  },
);

// Thunk #2: create one user — appends to items on fulfilled.
export const addUser = createAsyncThunk(
  "users/addUser",
  async (
    input: { name: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      return await createUser(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create user",
      );
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.lastAction = "loadUsers:pending";
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.lastAction = "loadUsers:fulfilled";
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? action.error.message ?? "Error");
        state.lastAction = "loadUsers:rejected";
      })
      .addCase(addUser.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
        state.lastAction = "addUser:pending";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.createStatus = "idle";
        state.items = [...state.items, action.payload];
        state.lastAction = "addUser:fulfilled";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = String(action.payload ?? action.error.message ?? "Error");
        state.lastAction = "addUser:rejected";
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
