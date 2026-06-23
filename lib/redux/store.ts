import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/lib/redux/counterSlice";

export function createDemoStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
  });
}

export type DemoStore = ReturnType<typeof createDemoStore>;
export type RootState = ReturnType<DemoStore["getState"]>;
export type AppDispatch = DemoStore["dispatch"];
