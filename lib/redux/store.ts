// Store for ReduxDemo — combines counter + ui slices into one global state tree.
// createDemoStore() is called inside ReduxDemo so each mount gets a fresh store.
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/lib/redux/counterSlice";
import uiReducer from "@/lib/redux/uiSlice";

export function createDemoStore() {
  return configureStore({
    reducer: {
      counter: counterReducer, // state.counter.*
      ui: uiReducer, // state.ui.*
    },
  });
}

// Types exported here so hooks.ts and selectors.ts know the store shape.
export type DemoStore = ReturnType<typeof createDemoStore>;
export type RootState = ReturnType<DemoStore["getState"]>;
export type AppDispatch = DemoStore["dispatch"];
