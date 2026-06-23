import { createSlice } from "@reduxjs/toolkit";

export type CounterState = {
  count: number;
  lastAction: string;
  // Static label — used to show selective subscriptions in the demo.
  label: string;
};

const initialState: CounterState = {
  count: 0,
  lastAction: "none",
  label: "Global Redux store",
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
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
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
