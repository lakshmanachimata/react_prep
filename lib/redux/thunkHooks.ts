// Typed react-redux hooks for ReduxThunkDemo's store (thunkStore.ts).
// Separate from hooks.ts because ThunkRootState only has state.users — not counter/ui.
import { useDispatch, useSelector } from "react-redux";
import type { ThunkAppDispatch, ThunkRootState } from "@/lib/redux/thunkStore";

export const useThunkDispatch = useDispatch.withTypes<ThunkAppDispatch>();
export const useThunkSelector = useSelector.withTypes<ThunkRootState>();
