// Second slice for ReduxDemo — proves multiple reducers can live in one store.
// Theme state is unrelated to counter; kept in its own file for clarity.
import { createSlice } from "@reduxjs/toolkit";

export type UiState = {
  theme: "light" | "dark";
};

const initialState: UiState = {
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: { payload: "light" | "dark" }) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
