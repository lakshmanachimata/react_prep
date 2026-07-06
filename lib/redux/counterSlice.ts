// Slice for ReduxDemo — counter state + one async thunk example (fetchBonus).
// A "slice" = one feature's state + reducers + actions, combined into one reducer.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type CounterState = {
  count: number;
  lastAction: string;
  label: string;
  status: "idle" | "loading";
};

const initialState: CounterState = {
  count: 0,
  lastAction: "none",
  label: "Global Redux store",
  status: "idle",
};

// createAsyncThunk: RTK's thunk helper — auto-dispatches pending/fulfilled/rejected.
export const fetchBonus = createAsyncThunk("counter/fetchBonus", async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return 5;
});

const counterSlice = createSlice({
  name: "counter",
  initialState,
  // Synchronous actions — run instantly when dispatched.
  reducers: {
    increment: (state) => {
      state.count += 1;
      state.lastAction = "increment";
    },
    decrement: (state) => {
      state.count -= 1;
      state.lastAction = "decrement";
    },
    reset: (state) => {
      state.count = 0;
      state.lastAction = "reset";
      state.status = "idle";
    },
  },
  // Handle async thunk lifecycle actions (see fetchBonus above).
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonus.pending, (state) => {
        state.status = "loading";
        state.lastAction = "fetchBonus:pending";
      })
      .addCase(fetchBonus.fulfilled, (state, action) => {
        state.count += action.payload;
        state.status = "idle";
        state.lastAction = "fetchBonus:fulfilled";
      })
      .addCase(fetchBonus.rejected, (state) => {
        state.status = "idle";
        state.lastAction = "fetchBonus:rejected";
      });
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
