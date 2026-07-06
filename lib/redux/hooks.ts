// Typed react-redux hooks for ReduxDemo's store (store.ts).
// withTypes<> gives autocomplete for state.counter, state.ui, and dispatch payloads.
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/redux/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
