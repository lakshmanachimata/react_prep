// Separate store for ReduxThunkDemo — only users slice, isolated from ReduxDemo.
// Two stores exist so toggling one demo does not share/mutate the other's state.
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "@/lib/redux/usersSlice";

export function createThunkDemoStore() {
  return configureStore({
    reducer: {
      users: usersReducer, // state.users.*
    },
  });
}

export type ThunkDemoStore = ReturnType<typeof createThunkDemoStore>;
export type ThunkRootState = ReturnType<ThunkDemoStore["getState"]>;
export type ThunkAppDispatch = ThunkDemoStore["dispatch"];
